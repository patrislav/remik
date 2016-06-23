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
      return state.set('messages', [...state.get('messages'), action.data])

    default:
      return state
  }
}
