import {Map, List, fromJS} from 'immutable'

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
    players: Map()
  }),

  hand: List()

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
        .set('hand', initialState.get('hand'))
        .set('cards', initialState.get('cards'))
        .set('seat', null)

    case actionTypes.game.HAND: {
      let cards = action.cards.map(code => Map({
        code, selected: false
      }))
      return state.set('hand', fromJS(cards))
    }

    case actionTypes.game.CARDS:
      return state.update('cards', c => c.merge(action.data))

    case actionTypes.game.DREW_CARD:
      return state.update('status', s => s.merge(action.status))

    case actionTypes.game.DISCARDED:
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

    case actionTypes.game.SELECT_HAND_CARD: {
      return state.update('hand', hand => hand.updateIn(
        [hand.findIndex(card => card.get('code') === action.code), 'selected'],
        selected => !selected
      ))
    }

    default:
      return state
  }
}
