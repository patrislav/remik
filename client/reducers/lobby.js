import {Map} from 'immutable'

import io from '../socket'
import actionTypes from '../actions/actionTypes'

const initialState = Map({
  rooms: [],
  users: [],
  friends: []
})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.lobby.RECEIVE_ROOMS:
      return state.set('rooms', action.rooms)

    case actionTypes.lobby.RECEIVE_USERS:
      return state.set('users', action.users)

    case actionTypes.lobby.RECEIVE_FRIENDS:
      return state.set('friends', action.friends)

    default:
      return state
  }
}
