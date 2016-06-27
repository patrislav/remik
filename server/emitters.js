import User from './models/user'
import Room from './models/room'

export default function (io, realm) {
  return {
    lobbyUsers: async (target = io) => {
      try {
        let socketIds = Object.keys(io.sockets.connected)
        let users = await User.find({ realm, socketId: { $in: socketIds } }).exec()
        target.emit('lobby.users', users)
      }
      catch(error) {
        console.log('emitLobbyUsers', error)
      }
    },

    roomUsers: async (target = io, room) => {
      try {
        User.find({ realm, id: { $in: room.users }})
          .then(users => {
            target.emit('room.users', room.id, users, room.players)
          })
      }
      catch(e) {
        console.log('emitRoomUsers', e)
      }
    },

    roomSettings: async (target = io, room) => {
      target.emit('room.settings', room.id, room.settings)
    },

    rooms: async (target = io) => {
      try {
        Room.find({ realm })
          .then(rooms => rooms.map(room => room.toJSON()))
          .then(rooms => {
            target.emit('lobby.rooms', rooms)
          })
      }
      catch(e) {
        console.log('emitRooms', e)
      }
    },
  }
}
