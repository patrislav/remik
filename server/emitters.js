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
        console.log('emitLobbyUsers', error) // eslint-disable-line no-console
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
        console.log('emitRoomUsers', e) // eslint-disable-line no-console
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
        console.log('emitRooms', e) // eslint-disable-line no-console
      }
    },

    // FIXME: Improve performance?
    gameStart: (target = io, room) => {
      const data = {
        board: room.cards.board,
        stock: room.cards.stock.length,
        discard: room.getLastDiscard(),
        players: room.getPlayersCardNums()
      }

      target.emit('game.started', room.id, room.status)
      target.emit('game.cards', room.id, data)

      for (let seat in room.players) {
        const player = room.players[seat]
        User.findOne({ realm, id: player.id })
          .then(user => {
            io.to(user.socketId).emit('game.hand', room.id, player.cards)
          })
      }
    },

    gameCards: (target = io, room) => {
      const state = room.getCurrentState()
      const data = {
        board: state.getIn(['cards', 'board']).toJS(),
        stock: state.getIn(['cards', 'stock']).size,
        discard: room.getLastDiscard(),
        players: room.getPlayersCardNums(state.toJS())
      }

      target.emit('game.cards', room.id, data)
    },

    playerHand: (target = io, room, user) => {
      const state = room.getCurrentState()
      const player = state.get('players').find(player => player.get('id') === user.id)
      if (player) {
        target.emit('game.hand', room.id, player.get('cards').toJS())
      }
    }
  }
}
