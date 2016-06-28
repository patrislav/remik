import socketIO from 'socket.io'
import User from './models/user'
import Room from './models/room'
import emitters from './emitters'

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
    // emitLobbyUsers(socket)
    socket.emit('me', user)
    emit.rooms(socket)

    socket.on('disconnect', async () => {
      socket.broadcast.emit('lobby.user_left', user)

      try {
        user.socketId = null
        await user.save()

        let room = await Room.findOne({ realm, users: user.id }).exec()
        if (room) {
          socket.broadcast.to(room.id).emit('room.user_left', room.id, user)
          if (room.removeUser(user.id)) {
            room.save()
          }
        }
      }
      catch(e) {
        console.log('disconnect', e)
      }
    })

    socket.on('room.join', async (roomId) => {
      try {
        let check = await Room.findOne({ realm, users: user.id }).exec()
        if (check) {
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
      let room = await Room.findOne({ realm, users: user.id }).exec()
      if (!room.users.includes(user.id)) {
        socket.emit('exception', 'room.leave', 'not in room')
        return
      }

      room.removeUser(user.id)
      await room.save()

      socket.leave(room.id)
      socket.emit('room.left', room.id)
      socket.broadcast.to(room.id).emit('room.user_left', room.id, user)
      emit.rooms(socket)
      emit.lobbyUsers(socket)
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
              return room.save()
            }
            else {
              throw new Error(`Cannot sit on seat '${seat}' in room ${room.id}`)
            }
          })
          .then((room) => {
            io.to(room.id).emit('game.user_joined', room.id, user.id, seat)
          })
      }
      catch(e) {
        console.log('game.join', e)
      }
    })

    socket.on('game.leave', async () => {
      try {
        Room.findOne({ realm, users: user.id })
          .then((room) => {
            if (room.removePlayer(user.id)) {
              return room.save()
            }
            else {
              throw new Error(`Cannot remove player ${user.id} from room ${room.id}`)
            }
          })
          .then((room) => {
            io.to(room.id).emit('game.user_left', room.id, user.id)
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
