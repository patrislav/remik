import socketIO from 'socket.io'
import User from './models/user'
import Room from './models/room'

function sockets(server) {
  const io = socketIO(server)

  // Socket.IO Connection logic
  io.on('connection', async (socket) => {
    let user, session = socket.request.session
    const { realm } = session

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
    emitRooms(socket)

    socket.on('disconnect', async () => {
      socket.broadcast.emit('lobby.user_left', user)

      try {
        user.socketId = null
        await user.save()

        let room = await Room.findOne({ realm, users: user.id }).exec()
        if (room) {
          room.removeUser(user.id)
          await room.save()
          socket.broadcast.to(room.id).emit('room.user_left', room.id, user)
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

        let room = await Room.findById(realm, roomId)

        console.log("Before ", room.users)
        room.addUser(user.id)
        console.log("After ", room.users)
        await room.save()

        socket.join(room.id)
        socket.emit('room.joined', room.id)
        socket.broadcast.to(room.id).emit('room.user_joined', room.id, user)

        emitRoomUsers(socket, room)
        emitRoomSettings(socket, room)
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
      emitRooms(socket)
      emitLobbyUsers(socket)
    })

    socket.on('room.create', async () => {
      let check = await Room.findOne({ realm, users: user.id }).exec()
      if (check) {
        socket.emit('exception', 'room.create', 'already in a room')
        return
      }

      try {
        let room = new Room({ realm })
        room.addUser(user.id)
        await room.save()

        socket.join(room.id)
        socket.emit('room.joined', room.id)
        io.to(room.id).emit('room.created', room.id)

        emitRoomUsers(socket, room)
        emitRoomSettings(socket, room)
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

    async function emitLobbyUsers(target) {
      try {
        let socketIds = Object.keys(io.sockets.connected)
        let users = await User.find({ realm, socketId: { $in: socketIds } }).exec()
        (target || io).emit('lobby.users', users)
      }
      catch(error) {
        console.log('emitLobbyUsers', error)
      }
    }

    async function emitRoomUsers(target = io, room) {
      try {
        User.find({ realm, id: { $in: room.users }})
          .then(users => {
            let players = {
              red: null, blue: null, green: null, yellow: null
            }

            target.emit('room.users', room.id, users, players)
          })
      }
      catch(e) {
        console.log('emitRoomUsers', e)
      }
    }

    async function emitRoomSettings(target, room) {
      (target || io).emit('room.settings', room.id, room.settings)
    }

    async function emitRooms(target) {
      try {
        Room.find({ realm })
          .then(rooms => rooms.map(room => room.toJSON()))
          .then(rooms => {
            (target || io).emit('lobby.rooms', rooms)
          })
      }
      catch(e) {
        console.log('emitRooms', e)
      }
    }
  })

  return io
}

export default sockets
