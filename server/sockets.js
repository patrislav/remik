import socketIO from 'socket.io'
import User from './models/user'
import Room from './models/room'
import emitters from './emitters'

import * as rummy from './rummy'

// TODO: Move this file into common directory
import {phases} from '../common/constants'

function sockets(server) {
  const io = socketIO(server)

  // Socket.IO Connection logic
  io.on('connection', async (socket) => {
    let user, session = socket.request.session
    const { realm } = session
    const emit = emitters(io, realm)

    try {
      if (realm === 'fb') {
        user = await User.findById('fb', session.fb.user.id)
      }
    }
    catch (error) {
      console.log('connect', 'no user')
      socket.emit('exception', 'connect', 'no user')
      socket.disconnect()
    }

    if (user.socketId in io.sockets.connected) {
      console.log('connect', 'already connected')
      socket.emit('exception', 'connect', 'already connected')
      socket.disconnect()
    }

    try {
      user.socketId = socket.id
      await user.save()
    }
    catch (error) {
      console.log('connect', 'cannot save user')
      socket.emit('exception', 'connect', 'cannot save user')
      socket.disconnect()
    }

    socket.broadcast.emit('lobby.user_joined', user)

    socket.emit('me', user)
    emit.rooms(socket)

    socket.on('disconnect', async () => {
      let stoppedGame = false
      socket.broadcast.emit('lobby.user_left', user)

      user.socketId = null
      user.save().then((user) => {
        Room.findOne({ realm, users: user.id })
          .then((room) => {
            // Returns true if the user was also removed from the playing list
            if (room.removeUser(user.id)) {
              // Returns true if the game was running and was stopped
              stoppedGame = room.stopGame()
            }

            return room.save()
          })
          .then((room) => {
            socket.broadcast.to(room.id).emit('room.user_left', room.id, user)
            socket.leave(room.id)

            if (stoppedGame) {
              io.to(room.id).emit('game.stopped', room.id, room.status)
            }

            if (room.users.length <= 0) {
              room.remove()
                .then(() => {
                  emit.rooms()
                })
            }
          })
      })
    })

    socket.on('room.join', async (roomId) => {
      try {
        let check = await Room.findOne({ realm, users: user.id }).exec()
        if (check && check.id != roomId) {
          socket.emit('exception', 'room.join', 'already in a room')
          return
        }

        Room.findOne({ realm, _id: roomId })
          .then((room) => {
            room.addUser(user.id)
            return room.save()
          })
          .then((room) => {
            socket.join(room.id)
            socket.emit('room.joined', room.id)
            socket.broadcast.to(room.id).emit('room.user_joined', room.id, user)

            emit.roomUsers(socket, room)
            emit.roomSettings(socket, room)
          })
      }
      catch(e) {
        console.log('room.join', e)
      }
    })

    socket.on('room.leave', async (roomId) => {
      let stoppedGame = false
      Room.findOne({ realm, users: user.id })
        .then((room) => {
          if (!room.users.includes(user.id)) {
            throw new Error('room.leave: not in room')
          }

          // Returns true if the user was also removed from the playing list
          if (room.removeUser(user.id)) {
            // Returns true if the game was running and was stopped
            stoppedGame = room.stopGame()
          }

          return room.save()
        })
        .catch((err) => {
          console.log(err)
        })
        .then((room) => {
          socket.broadcast.to(room.id).emit('room.user_left', room.id, user)
          socket.leave(room.id)

          socket.emit('room.left', room.id)
          emit.rooms(socket)
          emit.lobbyUsers(socket)

          if (stoppedGame) {
            io.to(room.id).emit('game.stopped', room.id, room.status)
          }

          if (room.users.length <= 0) {
            room.remove()
              .then(() => {
                emit.rooms()
              })
          }
        })
    })

    socket.on('room.create', async () => {
      let check = await Room.findOne({ realm, users: user.id }).exec()
      if (check) {
        socket.emit('exception', 'room.create', 'already in a room')
        return
      }

      try {
        let players = { red: null, blue: null }
        let room = new Room({ realm, players })
        room.addUser(user.id)
        await room.save()

        socket.join(room.id)
        socket.emit('room.joined', room.id)
        io.to(room.id).emit('room.created', room.id)

        emit.rooms()
        emit.roomUsers(socket, room)
        emit.roomSettings(socket, room)
      }
      catch (error) {
        socket.emit('exception', 'room.create', error)
      }
    })

    socket.on('chat.message', async (message) => {
      try {
        let room = await Room.findOne({ realm, users: user.id }).exec()
        if (!room) {
          socket.emit('exception', 'chat.message', 'not in any room')
          return
        }

        io.to(room.id).emit('chat.message', user.id, message)
      }
      catch(e) {
        console.log('chat.message', e)
      }
    })

    socket.on('chat.typing', async () => {
      try {
        let room = await Room.findOne({ realm, users: user.id }).exec()
        if (!room) {
          socket.emit('exception', 'chat.typing', 'not in any room')
          return
        }

        socket.broadcast.to(room.id).emit('chat.typing', user.id)
      }
      catch(e) {
        console.log('chat.typing', e)
      }
    })

    socket.on('game.join', async (seat) => {
      try {
        Room.findOne({ realm, users: user.id })
          .then((room) => {
            if (room.addPlayer(seat, user.id)) {
              room.startGame() // starts the game if possible
              return room.save()
            }
            else {
              throw new Error(`Cannot sit on seat '${seat}' in room ${room.id}`)
            }
          })
          .then((room) => {
            io.to(room.id).emit('game.user_joined', room.id, user.id, seat)

            if (room.status.gameStarted) {
              emit.gameStart(io.to(room.id), room)
            }
          })
          .catch(e => console.log('game.join', e))
      }
      catch(e) {
        console.log('game.join', e)
      }
    })

    socket.on('game.draw_card', (pile) => {
      let state = {}
      Room.findOne({ realm, users: user.id })
        .then((room) => {
          if (!['stock', 'discard'].includes(pile)) {
            throw new Error('Incorrect pile name')
          }

          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.CARD_TAKING) {
            state = rummy.drawCard(room.toState(), seat, pile)
            return room.saveState(state)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then((room) => {
          io.to(room.id).emit('game.drew_card', room.id, user.id, room.status)
          emit.gameCards(io.to(room.id), room)

          // TODO: Temporary!!!
          for (let seat in room.players) {
            let player = room.players[seat]
            if (player.id === user.id) {
              socket.emit('game.hand', room.id, player.cards)
              break
            }
          }
        })
        .catch(e => console.log('game.draw_card', e))
    })

    socket.on('game.discard', (code) => {
      let state = {}
      Room.findOne({ realm, users: user.id})
        .then((room) => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            state = rummy.finishTurn(room.toState(), seat, code)
            return room.saveState(state)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then((room) => {
          io.to(room.id).emit('game.discarded', room.id, user.id, room.status, state.get('discardedCard'))
          emit.gameCards(io.to(room.id), room)

          // TODO: Temporary!!!
          for (let seat in room.players) {
            let player = room.players[seat]
            if (player.id === user.id) {
              socket.emit('game.hand', room.id, player.cards)
              break
            }
          }
        })
        .catch(e => console.log('game.discard', e))
    })

    socket.on('game.meld_new', (cards) => {
      let state = {}
      Room.findOne({ realm, users: user.id })
        .then((room) => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            state = rummy.meldNew(room.toState(), seat, cards)
            return room.saveState(state)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then((room) => {
          io.to(room.id).emit('game.melded_new', room.id, user.id, room.status, state.get('meldedCards'))
          emit.gameCards(io.to(room.id), room)

          // TODO: Temporary!!!
          for (let seat in room.players) {
            let player = room.players[seat]
            if (player.id === user.id) {
              socket.emit('game.hand', room.id, player.cards)
              break
            }
          }
        })
        .catch(e => console.log('game.meld_new', e))
    })

    socket.on('game.leave', async () => {
      try {
        let stoppedGame = false
        Room.findOne({ realm, users: user.id })
          .then((room) => {
            if (room.removePlayer(user.id)) {
              stoppedGame = room.stopGame()
              return room.save()
            }
            else {
              throw new Error(`Cannot remove player ${user.id} from room ${room.id}`)
            }
          })
          .then((room) => {
            io.to(room.id).emit('game.user_left', room.id, user.id)

            if (stoppedGame) {
              io.to(room.id).emit('game.stopped', room.id, room.status)
            }
          })
      }
      catch(e) {
        console.log('game.leave', e)
      }
    })

  })

  return io
}

export default sockets
