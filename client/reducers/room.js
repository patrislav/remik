import {Map, fromJS} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  id: null,
  players: Map(),
  spectators: [],

  settings: Map({
    maxPlayers: 2,
    jokersPerDeck: 1,
    deckCount: 2,
    turnTime: 0
  })
})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.room.JOIN:
      return state.set('id', action.roomId)

    case actionTypes.room.LEAVE:
      return initialState

    case actionTypes.room.ROOM_SETTINGS:
      return state.set('settings', state.get('settings').merge(action.settings))

    case actionTypes.room.RECEIVE_USERS:
      if (state.get('id') !== action.roomId)
        return state
      let players = fromJS(action.players)
      console.log(players.toJS())
      return state.set('players', state.get('players').merge(action.players)).set('spectators', action.spectators)

    case actionTypes.room.USER_JOINED:
      if (state.get('id') !== action.roomId)
        return state
      return state.set('spectators', [...state.get('spectators'), action.user])

    case actionTypes.room.USER_LEFT:
      if (state.get('id') !== action.roomId)
        return state
      // state = state.update('players', players => {
      //   for (let v in players) {
      //     if (players[v].id === action.user.id) {
      //       players[v] = null
      //       break
      //     }
      //   }
      //   return players
      // })
      return state.set('spectators', state.get('spectators').filter((user) => user.id !== action.user.id))

    case actionTypes.game.USER_JOINED:
      return state.setIn(['players', action.seat], action.user)

    case actionTypes.game.USER_LEFT:
      let seat = findSeatByUserId(state, action.userId)
      if (seat) {
        state = state.setIn(['players', seat], null)
      }
      return state

    default:
      return state
  }
}

function findSeatByUserId(state, userId) {
  let players = state.get('players').toJS()
  for (let seat in players) {
    if (players[seat] && players[seat].id === userId) {
      return seat
    }
  }

  return null
}
