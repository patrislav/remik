import {PLAYER_COLOURS, SUIT_SYMBOLS, RANK_CODES} from '../../common/constants'
import rewire from 'rewire'

const rummyModule = rewire('../rummy.js')
const generateCards = rummyModule.__get__('generateCards')
const shuffle = rummyModule.__get__('shuffle')

const settings = {
  deckCount: 2,
  jokersPerDeck: 1
}

export function randomCards(boardNum, discardNum, playersNum, cardsPerPlayerNum) {
  const cards = shuffle(generateCards(settings))
  const players = {}

  for (let i = 0; i < Math.min(playersNum, PLAYER_COLOURS.length); i++) {
    const playerCards = []
    for (let j = 0; j < cardsPerPlayerNum; j++) {
      playerCards.push(cards.pop())
    }

    players[PLAYER_COLOURS[i]] = randomPlayer(playerCards)
  }

  const discard = cards.splice(0, discardNum)
  const board = [ [], [], [] ]
  const stock = cards.slice()

  return {
    cards: {
      board, stock, discard
    },
    players
  }
}

function randomPlayer(cards) {
  return {
    cards
  }
}
