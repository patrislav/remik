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
            target.emit('room.users', room.id, users, room.getPlayerIds())
          })
      }
      catch(e) {
        console.log('emitRoomUsers', e)
      }
    },

    roomSettings: (target = io, room) => {
      target.emit('room.settings', room.id, room.settings)
    },

    rooms: (target = io) => {
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

    // FIXME: Improve performance?
    gameStart: (target = io, room) => {
      target.emit('game.started', room.id, room.status)
      target.emit('game.cards', room.id, room.cards.board, room.cards.stack.length, room.cards.discard)

      for (let seat in room.players) {
        let player = room.players[seat]
        User.findOne({ realm, id: player.id })
          .then(user => {
            io.to(user.socketId).emit('game.hand', room.id, player.cards)
          })
      }
    },
  }
}
