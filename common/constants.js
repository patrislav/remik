
export const phases = {
  WAITING_FOR_PLAYERS: 0,
  COUNTDOWN: 1,
  CARD_TAKING: 2,
  BASE_TURN: 3
}
export const INITIAL_CARDS = 13
export const PLAYER_COLOURS = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']
export const RANKS = [1,2,3,4,5,6,7,8,9,10,11,12,13]
export const RANK_SYMBOLS = {A: 1, D: 10, J: 11, Q: 12, K: 13}
export const SUIT_SYMBOLS = ['s', 'h', 'd', 'c']
export const RANK_CODES = generateRankCodes(RANKS, RANK_SYMBOLS)


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
