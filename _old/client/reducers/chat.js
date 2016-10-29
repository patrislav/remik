import {Map, List} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  messages: List(),
  typingUserTimes: Map(),
  typingUpdatedAt: 0
})

/**
 * Default reducer
 *
 * @param {Immutable.Map} state The state to be reduced
 * @param {object} action The action passed to the reducer
 * @return {Immutable.Map} state The resulting state
 */
export default (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.SWITCH_SCREEN:
    return initialState

  case actionTypes.RECEIVE_MESSAGE: {
    const { user, message } = action
    return addMessage(state, { user, message })
      .setIn(['typingUserTimes', user.id], 0)
      .set('typingUpdatedAt', Date.now())
  }

  case actionTypes.CHAT_TYPING:
    return state.setIn(['typingUserTimes', action.userId], action.time)
      .set('typingUpdatedAt', Date.now())

  case actionTypes.CHAT_TYPING_UPDATE:
    return state.set('typingUpdatedAt', Date.now())

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

  case actionTypes.game.OVER:
    return addMessage(state, {
      message: `The game was won by ${action.user.firstName}`
    })

  default:
    return state
  }
}

function addMessage(state, data) {
  return state.update('messages', messages => messages.push(data))
}
