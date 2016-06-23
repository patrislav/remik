import {Map} from 'immutable'

import actionTypes from '../actions/actionTypes'

const initialState = Map({
  screen: 'preload'
})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  console.log(action)

  switch (action.type) {
    case actionTypes.SWITCH_SCREEN:
      return state.set('screen', action.screen)

    default:
      return state
  }
}
