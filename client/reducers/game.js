import {Map} from 'immutable'

import actionTypes from '../actions/actionTypes'
import {phases} from '../constants'

const initialState = Map({
  screen: 'preload',

  // GAME DATA
  status: Map({
    gameStarted: false,
    phase: phases.WAITING,
    currentPlayer: null,
    turnStartedAt: null
  })

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
