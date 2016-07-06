import {fromJS} from 'immutable'
// TODO: Move this file into common directory
import {phases} from '../client/constants'

// TODO: Move these into constants file
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13],
  rankSymbols = {A: 1, J: 11, Q: 12, K: 13},
  suitSymbols = ['s', 'h', 'd', 'c']
const rankCodes = generateRankCodes(ranks, rankSymbols)
const INITIAL_CARDS = 13
const PLAYER_COLOURS = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']

export function startGame(state) {
  state = clearBoard(state)
  let stack = shuffle(generateCards(state.get('settings').toJS()))
  state = dealCards(state.setIn(['cards', 'stack'], fromJS(stack)))

  let status = {
    gameStarted: true,
    phase: phases.CARD_TAKING,
    currentPlayer: randomSeat(state.get('players').toJS()),
    turnStartedAt: Date.now()
  }
  state = state.set('status', fromJS(status))

  return state
}

export function stopGame(state) {
  state = clearBoard(state)
  let status = {
    gameStarted: false,
    phase: phases.WAITING_FOR_PLAYERS,
    currentPlayer: null,
    turnStartedAt: null
  }
  return state.set('status', fromJS(status))
}

export function clearBoard(state) {
  let cards = {
    board: [],
    stack: [],
    discard: []
  }
  let players = state.get('players').toJS()
  for (let i in players) {
    players[i].cards = []
  }
  return state.set('cards', fromJS(cards)).set('players', fromJS(players))
}

export function meld(state, playerSeat, cards) {
  // TODO
  return state
}

// TODO: More checks!!!
export function drawCard(state, playerSeat, pileName) {
  let pile = state.getIn(['cards', pileName]).toJS(),
    player = state.getIn(['players', playerSeat]).toJS()

  let drewCard = pile.pop()
  player.cards.push(drewCard)

  if (pileName === 'discard') {
    player.drewFromDiscard = drewCard
  }

  return state.setIn(['cards', pileName], fromJS(pile))
    .setIn(['players', playerSeat], fromJS(player))
    .setIn(['status', 'phase'], phases.BASE_TURN)
    .set('drewCard', drewCard)
}

export function finishTurn(state, playerSeat, discarded) {
  let players = state.get('players').toJS(),
    discardPile = state.getIn(['cards', 'discard']).toJS(),
    player = players[playerSeat]

  let index = player.cards.indexOf(discarded)
  if (index < 0) {
    throw new Error("The card that's about to be discarded is not in player's hand")
  }

  player.cards.splice(index, 1)
  discardPile.push(discarded)

  return state.setIn(['players', playerSeat], fromJS(player))
    .setIn(['cards', 'discard'], fromJS(discardPile))
    .setIn(['status', 'currentPlayer'], nextPlayerSeat(playerSeat, players))
    .setIn(['status', 'phase'], phases.CARD_TAKING)
    .set('discardedCard', discarded)
}

function dealCards(state) {
  let stack = state.getIn(['cards', 'stack']).toJS(),
    discard = state.getIn(['cards', 'discard']).toJS(),
    players = state.get('players').toJS()
  for (let i = 0; i < INITIAL_CARDS; i++) {
    for (let seat in players) {
      players[seat].cards.push(stack.pop())
    }
  }

  discard.push(stack.pop())

  return state.setIn(['cards', 'stack'], fromJS(stack))
    .setIn(['cards', 'discard'], fromJS(discard))
    .set('players', fromJS(players))
}

function generateCards(settings) {
  let { deckCount, jokersPerDeck } = settings
  let stack = []

  for (let i = 0; i < deckCount; i++) {
    for (let suit of suitSymbols) {
      for (let rankCode of rankCodes) {
        stack.push(rankCode + suit + '.' + i)
      }
    }

    for (let i = 0; i < jokersPerDeck; i++) {
      stack.push('X.' + i)
    }
  }

  return stack
}

// FIXME: Ugly!
function generateRankCodes(ranks, rankSymbols) {
  let rankCodes = []

  for (let rank of ranks) {
    let found = false
    for (let symbol in rankSymbols) {
      if (rankSymbols[symbol] === rank) {
        rankCodes.push(symbol)
        found = true
      }
    }

    if (!found) {
      rankCodes.push(rank.toString())
    }
  }

  return rankCodes
}


function shuffle(array) {
  for (let i = array.length-1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

function randomSeat(players) {
  let seats = Object.keys(players)
  return seats[Math.floor(Math.random() * seats.length)]
}

function nextPlayerSeat(currentPlayerSeat, players) {
  let index = PLAYER_COLOURS.indexOf(currentPlayerSeat)
  if (index < 0) {
    return null
  }

  if (players[PLAYER_COLOURS[index+1]]) {
    return PLAYER_COLOURS[index+1]
  }
  else {
    return PLAYER_COLOURS[0]
  }
}
