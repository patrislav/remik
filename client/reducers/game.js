import {Map, List, fromJS} from 'immutable'

import actionTypes from '../actions/actionTypes'
import {phases} from '../../common/constants'

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
    board: List(),
    discard: null,
    stock: 0,
    players: Map()
  }),

  hand: List()

})

/**
 * Default reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SWITCH_SCREEN:
      return state.set('screen', action.screen)

    case actionTypes.RECEIVE_ME:
      return state.set('user', action.user)

    case actionTypes.game.STARTED:
      return state.update('status', s => s.merge(action.status))

    case actionTypes.game.STOPPED:
      return state.set('status', initialState.get('status'))
        .set('hand', initialState.get('hand'))
        .set('cards', initialState.get('cards'))

    // Alternatively, use ADD_HAND_CARDS and REMOVE_HAND_CARDS
    case actionTypes.game.HAND: {
      let newCards = action.cards
        .filter(code => state.get('hand').findIndex(card => card.get('code') === code) < 0)
        .map(code => Map({ code, selected: false }))
      state = state.update('hand', hand =>
        hand.filter(card => action.cards.indexOf(card.get('code')) >= 0)
          .concat(newCards)
      )

      return state
    }

    case actionTypes.game.CARDS:
      return state.set('cards', fromJS(action.data))

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
