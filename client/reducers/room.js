import {Map} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  id: null,
  players: [],
  spectators: []
})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.lobby.JOIN_ROOM:
      return state.set('id', action.roomId)

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
      const removeUser = (user) => user.id !== action.user.id
      return state.set('spectators', state.get('spectators').filter(removeUser))
        .set('players', state.get('players').filter(removeUser))

    default:
      return state
  }
}
