
import {
  RANKS, RANK_SYMBOLS, RANK_CODES, SUIT_SYMBOLS
} from './constants'

export function checkGroupValidity(cards) {
  const acePosition = 'both'

  if (!cards || cards.length < 3) {
    return { valid: false, reason: 'TODO' }
  }

  let ranks = cards.map(getRank),
    ranksWithoutJokers = ranks.filter(rank => rank !== 'X'),
    uniqueValues = unique(ranksWithoutJokers),
    jokerCount = ranks.reduce((total, x) => (x === 'X' ? total+1 : total), 0)

  let suits = cards.map(getSuit),
    suitsWithoutJokers = suits.filter(suit => suit !== 'X'),
    uniqueSuits = unique(suitsWithoutJokers)

  if ((ranks.length == 3 && jokerCount > 1)
  || ( ranks.length == 4 && jokerCount > 2)) {
    return { valid: false, reason: 'TODO' }
  }

  // Set
  if (uniqueValues.length == 1 && uniqueSuits.length == suitsWithoutJokers.length) {
    return { valid: true, groupType: 'set' }
  }

  // If there is an ace
  let aceIndex = ranksWithoutJokers.indexOf(1)
  if (aceIndex >= 0 && acePosition === 'both') {
    if (ranks.indexOf(13) >= 0 || (jokerCount > 0 && ranks.indexOf(12) >= 0)) {
      ranksWithoutJokers[aceIndex] = 14
    }
    else if (ranks.indexOf(2) < 0 && !(jokerCount > 0 && ranks.indexOf(3) >= 0)) {
      return { valid: false, reason: 'TODO' }
    }
  }
  else if (aceIndex >= 0 && acePosition === 'high') {
    ranksWithoutJokers[aceIndex] = 14
  }

  // Run
  if (uniqueSuits.length == 1 && uniqueValues.length == ranksWithoutJokers.length
  && isConsecutive(ranksWithoutJokers, jokerCount)) {
    return { valid: true, groupType: 'run' }
  }

  return { valid: false, reason: 'TODO' }
}


function getRank(card) {
  let code = card.charAt(0)
  if (code === 'X') {
    return 'X'
  }
  return (code in RANK_SYMBOLS ? RANK_SYMBOLS[code] : parseInt(code))
}

function getSuit(card) {
  if (card.charAt(0) === 'X') {
    return 'X'
  }
  return SUIT_SYMBOLS.indexOf(card.charAt(1))
}

function parseCardCode(code) {
  if (code.charAt(0) === 'X') {
    return { joker: 1, suit: 'X', rank: 'X' }
  }

  const regex = new RegExp(`(${RANK_CODES.join('|')})(${SUIT_SYMBOLS.join('|')})`, 'g')

  const match = regex.exec(code)

  if (!match) {
    return false
  }

  let rank = ((match[1] in RANK_SYMBOLS) ? RANK_SYMBOLS[match[1]] : parseInt(match[1])),
    suit = SUIT_SYMBOLS.indexOf(match[2])

  return { rank, suit }
}


function unique(array) {
  let seen = new Set()
  return array.filter((item) => {
    if (!seen.has(item)) {
      seen.add(item)
      return true
    }
  })
}

function isConsecutive(array, jokerCount = 0) {
  // Sort the array numerically in ascending order
  array.sort((a, b) => a - b)

  for (let i = 0; i < array.length-1; i++) {
    if (array[i+1] !== array[i]+1) {
      if (jokerCount > 0 && array[i+1] === array[i]+2) {
        jokerCount -= 1
      }
      else {
        return false
      }
    }
  }
  return true
}
