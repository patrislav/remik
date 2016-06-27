import {Map, fromJS} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  id: null,
  players: {},
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
    case actionTypes.lobby.JOIN_ROOM:
      return state.set('id', action.roomId)

    case actionTypes.room.ROOM_SETTINGS:
      return state.set('settings', state.get('settings').merge(action.settings))

    case actionTypes.room.RECEIVE_USERS:
      if (state.get('id') !== action.roomId)
        return state
      return state.set('players', action.players).set('spectators', action.spectators)

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

    default:
      return state
  }
}
