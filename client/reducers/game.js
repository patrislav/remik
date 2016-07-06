import {Map, List} from 'immutable'

import actionTypes from '../actions/actionTypes'
import {phases} from '../constants'

const initialState = Map({
  screen: 'preload',
  user: null,
  seat: null,

  // GAME DATA
  status: Map({
    gameStarted: false,
    phase: phases.WAITING_FOR_PLAYERS,
    currentPlayer: null,
    turnStartedAt: null
  }),

  cards: Map({
    board: [],
    discard: null,
    stack: 0,
    players: {}
  }),

  hand: []

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
        .set('seat', null).set('hand', [])
        .set('cards', initialState.get('cards'))

    case actionTypes.game.HAND:
      return state.set('hand', action.cards)

    case actionTypes.game.CARDS:
      return state.update('cards', c => c.merge(action.data))

    case actionTypes.game.DREW_CARD:
      return state.update('status', s => s.merge(action.status))

    case actionTypes.game.USER_JOINED:
      if (action.user.id === state.get('user').id) {
        state = state.set('seat', action.seat)
      }
      return state

    case actionTypes.game.USER_LEFT:
      if (action.userId === state.get('user').id) {
        state = state.set('seat', null)
      }
      return state

    default:
      return state
  }
}
