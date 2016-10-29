
import {
  RANK_SYMBOLS, SUIT_SYMBOLS
} from './constants'

export function checkGroupValidity(cards) {
  const acePosition = 'both'

  if (!cards || cards.length < 3) {
    return { valid: false, reason: 'TODO' }
  }

  let ranks = cards.map(getRank),
    ranksWithoutJokers = ranks.filter(rank => rank !== 'X'),
    uniqueValues = unique(ranksWithoutJokers),
    jokerCount = ranks.reduce((total, x) => {
      return (x === 'X' ? total+1 : total)
    }, 0)

  let suits = cards.map(getSuit),
    suitsWithoutJokers = suits.filter(suit => suit !== 'X'),
    uniqueSuits = unique(suitsWithoutJokers)

  if ((ranks.length === 3 && jokerCount > 1)
  || ( ranks.length === 4 && jokerCount > 2)) {
    return { valid: false, reason: 'TODO' }
  }

  // Set
  if (uniqueValues.length === 1 && uniqueSuits.length === suitsWithoutJokers.length) {
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
  if (uniqueSuits.length === 1 && uniqueValues.length === ranksWithoutJokers.length
  && isConsecutive(ranksWithoutJokers, jokerCount)) {
    return { valid: true, groupType: 'run' }
  }

  return { valid: false, reason: 'TODO' }
}

export function orderGroup(group) {
  const aces = group.filter(c => getRank(c) === 1)
  const jokers = group.filter(c => getRank(c) === 'X')
  group = group
    .filter(c => getRank(c) !== 1 )
    .filter(c => getRank(c) !== 'X')
    .sort((a, b) => {
      const [ rankA, rankB, suitA, suitB ] = [ getRank(a), getRank(b), getSuit(a), getSuit(b) ]

      // First sort by suits
      if (suitA !== suitB) {
        return suitA - suitB
      }

      // Then by ranks
      return rankA - rankB
    })

  // Insert aces
  aces.forEach(ace => {
    // If group has a King, put an ace in the end
    if (group.find(code => getRank(code) === 13)) {
      group.push(ace)
    }
    // If group has a 2, put an ace in the beginning
    else if (group.find(code => getRank(code) === 2)) {
      group.unshift(ace)
    }
    // Otherwise, push it somewhere in the end
    else {
      group.push(ace)
    }
  })

  // Insert jokers
  jokers.forEach(joker => {
    // Find a gap
    for (let i = 0; i < group.length-1; i++) {
      if (getRank(group[i+1]) - getRank(group[i]) > 1
      || (getRank(group[i+1]) === 1 && getRank(group[i]) === 12)) {
        group.splice(i+1, 0, joker)
        return
      }
    }

    // If no gaps found, shove it in the end, unless the last card is an ace
    if (getRank(group[group.length-1]) === 1 && getRank(group[group.length-2]) !== 1) {
      group.unshift(joker)
    }
    else {
      group.push(joker)
    }
  })

  return group
}

// FIXME: This is one ugly function...
export function groupValue(cards) {
  const value = cards.reduce((total, card, index, cards) => {
    const rank = getRank(card)

    // Ace
    if (rank === 1) {
      if (getRank(cards[index+1]) === 2
      || (getRank(cards[index+1]) === 'X' && getRank(cards[index+2]) === 3)) {
        return parseInt(total + 1)
      }
      else {
        return parseInt(total + 11)
      }
    }

    // Joker
    if (rank === 'X') {
      let value
      // If it's a set
      const uniqueRanks = unique(cards.map(getRank).filter(rank => rank !== 'X'))
      if (uniqueRanks.length === 1) {
        if (uniqueRanks[0] === 1) {
          value = 11
        }
        else {
          value = uniqueRanks[0]
        }
      }
      else if (index === 0) {
        value = getRank(cards[index+1]) - 1
        value = value > 10 ? 10 : value
      }
      else if (index === cards.length-1) {
        value = getRank(cards[index-1]) + 1
        if (value === 14) {
          value = 11
        }
        else if (value > 10) {
          value = 10
        }
      }
      else {
        if (getRank(cards[index+1]) === 1) {
          value = 10
        }
        else if (getRank(cards[index+1]) === 'X') {
          value = getRank(cards[index-1]) + 1
          value = value > 10 ? 10 : value
        }
        else {
          value = getRank(cards[index+1]) - 1
          value = value > 10 ? 10 : value
        }
      }

      return total + value
    }

    return parseInt(total + (rank > 10 ? 10 : rank))
  }, 0)
  return value
}

export function takeableJokerPosition(cards) {
  if (cards.length < 4) {
    return -1
  }

  if (getRank(cards[0]) === 'X') {
    return 0
  }

  if (getRank(cards[cards.length-1]) === 'X') {
    return cards.length-1
  }

  return -1
}


function getRank(card) {
  if (!card) {
    return -1
  }

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
