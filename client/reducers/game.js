import {Map} from 'immutable'

import actionTypes from '../actions/actionTypes'
import {phases} from '../constants'

const initialState = Map({
  screen: 'preload',
  user: null,

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

    case actionTypes.RECEIVE_ME:
      return state.set('user', action.user)

    case actionTypes.game.STARTED:
      return state.update('status', s => s.merge(action.status))

    case actionTypes.game.STOPPED:
      return state.update('status', s => s.merge(action.status))

    default:
      return state
  }
}
