import {Map} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  messages: []
})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_MESSAGE:
      return addMessage(state, action.data)

    case actionTypes.room.USER_JOINED:
      return addMessage(state, {
        user: action.user,
        code: 'user_joined_spectating'
      })

    case actionTypes.room.USER_LEFT:
      return addMessage(state, {
         user: action.user,
         code: 'user_left'
      })

    case actionTypes.game.USER_JOINED:
      return addMessage(state, {
        user: action.user,
        code: 'user_joined_playing'
      })

    case actionTypes.game.STARTED:
      return addMessage(state, {
        message: 'The game may now start!'
      })

    default:
      return state
  }
}

function addMessage(state, data) {
  return state.set('messages', [...state.get('messages'), data])
}
