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
      let data = {
        board: room.cards.board,
        stock: room.cards.stock.length,
        discard: room.getLastDiscard(),
        players: room.getPlayersCardNums()
      }

      target.emit('game.started', room.id, room.status)
      target.emit('game.cards', room.id, data)

      for (let seat in room.players) {
        let player = room.players[seat]
        User.findOne({ realm, id: player.id })
          .then(user => {
            io.to(user.socketId).emit('game.hand', room.id, player.cards)
          })
      }
    },

    gameCards: (target = io, room) => {
      let state = room.getCurrentState()
      let data = {
        board: state.cards.board,
        stock: state.cards.stock.length,
        discard: room.getLastDiscard(),
        players: room.getPlayersCardNums(state)
      }

      target.emit('game.cards', room.id, data)
    }
  }
}
