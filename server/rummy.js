import {fromJS} from 'immutable'
import {checkGroupValidity, orderGroup} from '../common/cards'
import {
  phases,
  INITIAL_CARDS,
  PLAYER_COLOURS,
  SUIT_SYMBOLS,
  RANK_CODES
} from '../common/constants'

// FIXME: Maybe use the Immutables themselves instead of converting using toJS?
export function startGame(state) {
  state = clearBoard(state)
  let stock = shuffle(generateCards(state.get('settings').toJS()))
  state = dealCards(state.setIn(['cards', 'stock'], fromJS(stock)))

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
    stock: [],
    discard: []
  }
  let players = state.get('players').toJS()
  for (let i in players) {
    if (players[i]) {
      players[i].cards = []
    }
  }
  return state.set('cards', fromJS(cards)).set('players', fromJS(players))
}

export function meldNew(state, playerSeat, cards) {
  const check = checkGroupValidity(cards)
  if (!check.valid) {
    throw new Error('meldNew', check.reason)
  }

  cards = orderGroup(cards)

  let change = {
    type: 'meldNew',
    playerSeat, cards
  }
  return state.update('changes', changes => changes.push(fromJS(change)))
    .set('meldedCards', cards)
}

export function meldExisting(state, playerSeat, group, cards) {
  if (findGroupIndex(state, group) < 0) {
    throw new Error('meldExisting no such group found: ' + group)
  }

  const check = checkGroupValidity(group.concat(cards))
  if (!check.valid) {
    throw new Error('meldExisting invalid ' + JSON.stringify(group.concat(cards)) + JSON.stringify(check))
  }

  // const result = orderGroup(group.concat(cards))

  let change = {
    type: 'meldExisting',
    playerSeat, group, cards
  }
  return state.update('changes', changes => changes.push(fromJS(change)))
}

// TODO: More checks!!!
// FIXME: Maybe use the Immutables themselves instead of converting using toJS?
export function drawCard(state, playerSeat, pileName) {
  let player = state.getIn(['players', playerSeat]).toJS(),
    stockPile = state.getIn(['cards', 'stock']).toJS(),
    discardPile = state.getIn(['cards', 'discard']).toJS()

  let drewCard
  if (pileName === 'stock') {
    drewCard = stockPile.pop()

    // If the stock is empty, use the shuffled cards from the discard pile
    if (stockPile.length <= 0) {
      let lastCard = discardPile.pop()
      stockPile = shuffle(discardPile.slice())
      discardPile = [lastCard]
    }
  }
  else if (pileName === 'discard') {
    drewCard = discardPile.pop()
    player.drewFromDiscard = drewCard
  }
  else {
    throw new Error("The pile name must be either 'stock' or 'discard'")
  }

  player.cards.push(drewCard)

  return state.setIn(['cards', 'stock'], fromJS(stockPile))
    .setIn(['cards', 'discard'], fromJS(discardPile))
    .setIn(['players', playerSeat], fromJS(player))
    .setIn(['status', 'phase'], phases.BASE_TURN)
    .set('drewCard', drewCard)
}

export function finishTurn(state, playerSeat, discarded) {
  state = applyChanges(state)

  let players = state.get('players'),
    discardPile = state.getIn(['cards', 'discard']),
    player = players.get(playerSeat)

  let index = player.get('cards').indexOf(discarded)
  if (index < 0) {
    throw new Error("The card that's about to be discarded is not in player's hand")
  }

  player = player.update('cards', cards => cards.delete(index))
  discardPile = discardPile.push(discarded)

  return state.setIn(['players', playerSeat], player)
    .setIn(['cards', 'discard'], discardPile)
    .setIn(['status', 'currentPlayer'], nextPlayerSeat(playerSeat, players))
    .setIn(['status', 'phase'], phases.CARD_TAKING)
    .set('discardedCard', discarded)
}

export function applyChanges(state) {
  let changes = state.get('changes'),
    board = state.getIn(['cards', 'board']),
    players = state.get('players')

  changes.forEach(change => {
    switch (change.get('type')) {
      case 'meldNew':
        board = board.push(change.get('cards'))
        players = players.updateIn([change.get('playerSeat'), 'cards'], cards =>
          cards.filter(card => change.get('cards').indexOf(card) < 0)
        )
        break

      case 'meldExisting': {
        const index = findGroupIndex(state, change.get('group').toJS())
        if (index >= 0) {
          board = board.update(index, group =>
            fromJS(orderGroup(group.concat(change.get('cards')).toJS()))
          )
          players = players.updateIn([change.get('playerSeat'), 'cards'], cards =>
            cards.filter(card => change.get('cards').indexOf(card) < 0)
          )
        }
        break
      }
    }
  })

  changes = changes.clear()

  return state.set('changes', changes)
    .setIn(['cards', 'board'], board)
    .set('players', players)
}

export function rollbackChanges(state) {
  return state.update('changes', changes => changes.clear())
}

export function findGroupIndex(state, group) {
  return state.getIn(['cards', 'board']).findIndex(g => g.toJS().sort().toString() === group.sort().toString())
}

// FIXME: Maybe use the Immutables themselves instead of converting using toJS?
function dealCards(state) {
  let stock = state.getIn(['cards', 'stock']).toJS(),
    discard = state.getIn(['cards', 'discard']).toJS(),
    players = state.get('players').toJS()
  for (let i = 0; i < INITIAL_CARDS; i++) {
    for (let seat in players) {
      players[seat].cards.push(stock.pop())
    }
  }

  discard.push(stock.pop())

  return state.setIn(['cards', 'stock'], fromJS(stock))
    .setIn(['cards', 'discard'], fromJS(discard))
    .set('players', fromJS(players))
}

function generateCards(settings) {
  let { deckCount, jokersPerDeck } = settings
  let stock = []

  for (let i = 0; i < deckCount; i++) {
    for (let suit of SUIT_SYMBOLS) {
      for (let rankCode of RANK_CODES) {
        stock.push(rankCode + suit + '.' + i)
      }
    }

    for (let j = 0; j < jokersPerDeck; j++) {
      stock.push('X' + j + '.' + i)
    }
  }

  return stock
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

  if (players.get(PLAYER_COLOURS[index+1])) {
    return PLAYER_COLOURS[index+1]
  }
  else {
    return PLAYER_COLOURS[0]
  }
}
