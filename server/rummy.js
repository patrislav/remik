import {fromJS} from 'immutable'
import {checkGroupValidity, orderGroup, takeableJokerPosition} from '../common/cards'
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
  state = dealCards(state.setIn(['cards', 'stock'], fromJS(stock)), INITIAL_CARDS)

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

/**
 * Meld new card group
 *
 * @param {string} playerSeat The colour of current player
 * @param {string[]} cards The cards to meld
 * @returns {Immutable.Map} change
 */
export function meldNew(playerSeat, cards) {
  const check = checkGroupValidity(cards)
  if (!check.valid) {
    throw new Error('meldNew', check.reason)
  }

  cards = orderGroup(cards)

  let change = {
    type: 'meldNew',
    playerSeat, cards
  }
  return fromJS(change)
}

/**
 * Add new cards to an existing group on the board
 *
 * @param {Immutable.Map} currentState The current game state
 * @param {string} playerSeat The colour of current player
 * @param {string[]} group The group to which the cards should be added
 * @param {string[]} cards The cards to add
 * @returns {Immutable.Map} change
 */
export function meldExisting(currentState, playerSeat, group, cards) {
  if (findGroupIndex(currentState, group) < 0) {
    throw new Error('meldExisting no such group found: ' + group)
  }

  const check = checkGroupValidity(group.concat(cards))
  if (!check.valid) {
    throw new Error('meldExisting invalid ' + JSON.stringify(group.concat(cards)) + JSON.stringify(check))
  }

  // const result = orderGroup(group.concat(cards))

  const change = {
    type: 'meldExisting',
    playerSeat, group, cards
  }
  return fromJS(change)
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

/**
 * Take the joker from a group of cards on the board if the joker is free to take.
 *
 * @param {Immutable.Map} currentState The current state
 * @param {string} playerSeat The colour of current player
 * @param {string[]} group The group from which the joker is to be taken
 * @returns {Immutable.Map} change
 */
export function takeJoker(currentState, playerSeat, group) {
  if (currentState.getIn(['players', playerSeat, 'jokerTaken']) !== null) {
    throw new Error('takeJoker This player has taken a joker this turn already')
  }

  if (findGroupIndex(currentState, group) < 0) {
    throw new Error('takeJoker no such group found: ' + group)
  }

  if (takeableJokerPosition(group) < 0) {
    throw new Error('takeJoker invalid ' + JSON.stringify(group))
  }

  const change = {
    type: 'takeJoker',
    playerSeat, group
  }
  return fromJS(change)
}

/**
 * Finishes the turn of current player by discarding a card from their hand
 *
 * @param {Immutable.Map} state The game state
 * @param {string} playerSeat The player seat's colour
 * @param {string} discarded The card to be discarded
 * @returns {Immutable.Map} state
 */
export function finishTurn(state, playerSeat, discarded) {
  state = applyChanges(state)

  let players = state.get('players'),
    discardPile = state.getIn(['cards', 'discard']),
    player = players.get(playerSeat)

  let index = player.get('cards').indexOf(discarded)
  if (index < 0) {
    throw new Error("The card that's about to be discarded is not in player's hand")
  }

  // IDEA: Consider instead treating it as an undo?
  if (player.get('drewFromDiscard') && player.get('drewFromDiscard') === discarded) {
    throw new Error('A card that has been taken from the discard pile cannot be discarded again')
  }

  if (player.get('jokerTaken') !== null) {
    throw new Error('The joker that had been taken, was not used this turn')
  }

  player = player.update('cards', cards => cards.delete(index))
  discardPile = discardPile.push(discarded)

  return state.setIn(['players', playerSeat], player)
    .setIn(['cards', 'discard'], discardPile)
    .setIn(['status', 'currentPlayer'], nextPlayerSeat(playerSeat, players))
    .setIn(['status', 'phase'], phases.CARD_TAKING)
    .set('discardedCard', discarded)
}

/**
 * Loops over the state.changes list and executes them, saving them in state.
 *
 * @param {Immutable.Map} state The current game state
 * @returns {Immutable.Map} state The resulting state
 */
export function applyChanges(state) {
  let changes = state.get('changes'),
    board = state.getIn(['cards', 'board']),
    players = state.get('players')

  changes.forEach(change => {
    const seat = change.get('playerSeat')

    switch (change.get('type')) {
    case 'meldNew': {
      board = board.push(change.get('cards'))
      players = players.updateIn([seat, 'cards'], cards =>
        cards.filter(card => change.get('cards').indexOf(card) < 0)
      )

      // If we are putting on the table a joker that we have taken earlier
      if (change.get('cards').includes(players.getIn([seat, 'jokerTaken']))) {
        players = players.setIn([seat, 'jokerTaken'], null)
      }
      break
    }

    case 'meldExisting': {
      const index = findGroupIndex(state, change.get('group').toJS())
      if (index >= 0) {
        board = board.update(index, group =>
          fromJS(orderGroup(group.concat(change.get('cards')).toJS()))
        )
        players = players.updateIn([seat, 'cards'], cards =>
          cards.filter(card => change.get('cards').indexOf(card) < 0)
        )

        // If we are putting on the table a joker that we have taken earlier
        if (change.get('cards').includes(players.getIn([seat, 'jokerTaken']))) {
          players = players.setIn([seat, 'jokerTaken'], null)
        }
      }
      else {
        throw new Error('applyChanges() meldExisting: cannot find group')
      }
      break
    }

    case 'takeJoker': {
      const index = findGroupIndex(state, change.get('group').toJS())
      if (index >= 0) {
        const position = takeableJokerPosition(board.get(index).toJS())
        const joker = board.getIn([index, position])
        board = board.update(index, group => group.delete(position))
        players = players
          .updateIn([seat, 'cards'], cards => cards.push(joker))
          .setIn([seat, 'jokerTaken'], joker)
      }
      else {
        throw new Error('applyChanges() meldExisting: cannot find group')
      }
      break
    }
    }

    // Update the state on each iteration of the forEach loop
    state = state.setIn(['cards', 'board'], board).set('players', players)
  })

  return state.update('changes', changes => changes.clear())
}

export function rollbackChanges(state) {
  return state.update('changes', changes => changes.clear())
}

export function undoLastChange(state, seat) {
  // Put back the card drawn from the discard pile
  const drewFromDiscard = state.getIn(['players', seat, 'drewFromDiscard'])
  if (state.get('changes').isEmpty() && drewFromDiscard) {
    state = state.setIn(['players', seat, 'drewFromDiscard'], null)
      .updateIn(['cards', 'discard'], pile => pile.push(drewFromDiscard))
  }

  return state.update('changes', changes => changes.pop())
}

export function findGroupIndex(state, group) {
  group = group.slice() // don't mutate the array!
  return state.getIn(['cards', 'board']).findIndex(g => g.toJS().sort().toString() === group.sort().toString())
}

/**
 * Deals `numCards` of cards to all the players
 *
 * @param {Immutable.Map} state The game state
 * @param {number} numCards The number of cards to deal to each player
 * @returns {Immutable.Map} state
 */
export function dealCards(state, numCards) {
  let stock = state.getIn(['cards', 'stock'])
  let discard = state.getIn(['cards', 'discard'])
  let players = state.get('players')

  for (let i = 0; i < numCards; i++) {
    players.forEach((player, seat) => {
      players = players.updateIn([seat, 'cards'], cards => cards.push(stock.last()))
      stock = stock.pop()
    })
  }

  discard = discard.push(stock.last())
  stock = stock.pop()

  return state.setIn(['cards', 'stock'], stock)
    .setIn(['cards', 'discard'], discard)
    .set('players', players)
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
