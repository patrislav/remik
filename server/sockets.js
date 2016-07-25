import socketIO from 'socket.io'
import User from './models/user'
import Room from './models/room'
import emitters from './emitters'

import * as rummy from './rummy'

// TODO: Move this file into common directory
import {phases} from '../common/constants'

function dumpError(error) {
  if (error.message) {
    console.error(error.message) // eslint-disable-line no-console
  }
  if (error.stack) {
    console.error('\nStacktrace\n====================') // eslint-disable-line no-console
    console.error(error.stack) // eslint-disable-line no-console
  }
}

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
      dumpError(error)
      socket.emit('exception', 'connect', 'no user')
      socket.disconnect()
    }

    if (user.socketId in io.sockets.connected) {
      dumpError({ message: 'already connected' })
      socket.emit('exception', 'connect', 'already connected')
      socket.disconnect()
    }

    try {
      user.socketId = socket.id
      await user.save()
    }
    catch (error) {
      dumpError(error)
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
        if (check && check.id !== roomId) {
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
        dumpError(e)
      }
    })

    // eslint-disable-next-line no-unused-vars
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
          dumpError(err)
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
        dumpError(e)
      }
    })

    socket.on('chat.typing', async () => {
      try {
        let room = await Room.findOne({ realm, users: user.id }).exec()
        if (!room) {
          socket.emit('exception', 'chat.typing', 'not in any room')
          return
        }

        socket.broadcast.to(room.id).emit('chat.typing', user.id, Date.now())
      }
      catch(e) {
        dumpError(e)
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
          .catch(e => dumpError(e))
      }
      catch(e) {
        dumpError(e)
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
          emit.playerHand(socket, room, user)
        })
        .catch(e => dumpError(e))
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
          emit.playerHand(socket, room, user)

          if (room.status.phase === phases.GAME_OVER) {
            io.to(room.id).emit('game.over', room.id, room.status)
          }
        })
        .catch(e => dumpError(e))
    })

    socket.on('game.meld_new', (cards) => {
      Room.findOne({ realm, users: user.id })
        .then((room) => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            const change = rummy.meldNew(seat, cards)
            const realState = room.toState()
              .update('changes', changes => changes.push(change))
            return room.saveState(realState)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then((room) => {
          let currentState = room.getCurrentState()

          io.to(room.id).emit('game.melded_new', room.id, user.id, currentState.status)
          emit.gameCards(io.to(room.id), room)
          emit.playerHand(socket, room, user)
        })
        .catch(e => dumpError(e))
    })

    socket.on('game.meld_existing', (group, cards) => {
      Room.findOne({ realm, users: user.id })
        .then(room => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            const change = rummy.meldExisting(room.getCurrentState(), seat, group, cards)
            const realState = room.toState()
              .update('changes', changes => changes.push(change))
            return room.saveState(realState)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then(room => {
          let currentState = room.getCurrentState()

          io.to(room.id).emit('game.melded_existing', room.id, user.id, currentState.status)
          emit.gameCards(io.to(room.id), room)
          emit.playerHand(socket, room, user)
        })
        .catch(e => dumpError(e))
    })

    socket.on('game.take_joker', (group) => {
      Room.findOne({ realm, users: user.id})
        .then(room => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            const change = rummy.takeJoker(room.getCurrentState(), seat, group)
            const realState = room.toState()
              .update('changes', changes => changes.push(change))
            return room.saveState(realState)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then(room => {
          // io.to(room.id).emit('game.took_joker', room.id, user.id, currentState.status)
          emit.gameCards(io.to(room.id), room)
          emit.playerHand(socket, room, user)
        })
        .catch(e => dumpError(e))
    })

    socket.on('game.undo_last', () => {
      let state = {}
      Room.findOne({ realm, users: user.id })
        .then(room => {
          let seat = room.getSeatByUserId(user.id)
          if (room.status.currentPlayer === seat && room.status.phase === phases.BASE_TURN) {
            state = rummy.undoLastChange(room.toState(), seat)
            return room.saveState(state)
          }
          else {
            throw new Error("Not player's turn!")
          }
        })
        .then(room => {
          io.to(room.id).emit('game.status', room.id, room.status)
          emit.gameCards(io.to(room.id), room)
          emit.playerHand(socket, room, user)
        })
        .catch(e => dumpError(e))
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
        dumpError(e)
      }
    })

    // // TODO: ONLY DEV THING
    // socket.on('devtest', async () => {
    //   const otherUserId = '101180776948192'
    //   const otherUser = await User.findOne({ realm, id: otherUserId })
    //   if (!otherUser) {
    //     throw new Error(`Cannot retrieve user with id ${otherUserId}`)
    //   }
    //   const otherSocket = io.sockets.connected[otherUser.socketId]
    //
    //   const players = { red: null, blue: null }
    //   const room = new Room({ realm, players })
    //   room.addUser(user.id)
    //   room.addUser(otherUser.id)
    //
    //   room.save()
    //     .then(room => {
    //       socket.join(room.id)
    //       socket.emit('room.joined', room.id)
    //       socket.broadcast.to(room.id).emit('room.user_joined', room.id, user)
    //
    //       emit.roomUsers(socket, room)
    //       emit.roomSettings(socket, room)
    //
    //       if (otherSocket) {
    //         otherSocket.join(room.id)
    //         otherSocket.emit('room.joined', room.id)
    //         otherSocket.broadcast.to(room.id).emit('room.user_joined', room.id, user)
    //
    //         emit.roomUsers(otherSocket, room)
    //         emit.roomSettings(otherSocket, room)
    //       }
    //
    //       room.addPlayer('red', user.id)
    //       room.addPlayer('blue', otherUser.id)
    //       room.startGame()
    //       return room.save()
    //     })
    //     .then(room => {
    //
    //     })
    // })

  })

  return io
}

export default sockets
