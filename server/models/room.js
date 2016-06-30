
import {Map, fromJS} from 'immutable'
import { model, index } from 'mongoose-decorators'
import User from './user'
import {startGame, stopGame} from '../rummy'
import {phases} from '../../client/constants'

const PLAYER_COLOURS = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']

const Player = (userId) => {
  return {
    id: userId,
    cards: [],
    drewFromDiscard: null,
    melded: false,
    madeFirstMove: false
  }
}

@model({
  realm: { type: String },
  settings: { type: Object, default: {
    maxPlayers: 2,
    jokersPerDeck: 1,
    deckCount: 2,
    deckBack: 'classic',
    deckFront: 'classic',
    turnTime: 0
  } },
  status: { type: Object, default: {
    currentPlayer: null,
    phase: phases.WAITING_FOR_PLAYERS,
    turnStartedAt: null,
    gameStarted: false
  } },
  cards: { type: Object, default: {
    board: [],
    stack: [],
    discard: []
  } },
  players: { type: Object, default: {} },
  users: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  creatorId: { type: String, default: null }
})
@index({ realm: 1 })
class Room {

  // setup() {
  //   this.settings = {
  //     maxPlayers: 2,
  //     jokersPerDeck: 1,
  //     deckCount: 2,
  //     deckBack: 'classic',
  //     deckFront: 'classic',
  //     turnTime: 0
  //   }
  //   this.status = {
  //     currentPlayer: null,
  //     phase: phases.WAITING_FOR_PLAYERS,
  //     turnStartedAt: null,
  //     gameStarted: false
  //   }
  //   this.cards = {
  //     board: [],
  //     stack: [],
  //     discard: []
  //   }
  // }

  get id() {
    return this._id
  }

  toJSON() {
    let { id } = this
    return { id }
  }

  /**
   * Adds a user with the given ID
   *
   * @param {string} userId
   */
  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId)
    }
  }

  /**
   * Removes a user with the given ID
   *
   * @param {string} userId
   * @return {boolean} result
   */
  removeUser(userId) {
    let index = this.users.indexOf(userId)
    if (index > -1) {
      this.users.splice(index, 1)
    }

    return this.removePlayer(userId)
  }

  /**
   * Adds a user as a player on a given seat
   *
   * @param {string} seat - One of PLAYER_COLOURS
   * @param {string} userId - ID of the user
   * @return {boolean} result
   */
  addPlayer(seat, userId) {
    // Return false if the user is already a player in this room
    for (let i in this.players) {
      if (this.players[i] && this.players[i].id === userId) {
        return false
      }
    }

    if (this.players.hasOwnProperty(seat) && !this.players[seat]) {
      this.addUser(userId)
      this.players[seat] = Player(userId)
      this.markModified('players') // otherwise it isn't persisted
      return true
    }

    return false
  }

  /**
   * Removes a player with given ID
   *
   * @param {string} userId - ID of the user to remove from player list
   * @return {boolean} result
   */
  removePlayer(userId) {
    for (let key in this.players) {
      if (this.players.hasOwnProperty(key) && this.players[key] && this.players[key].id === userId) {
        this.players[key] = null
        this.markModified('players') // otherwise it isn't persisted
        return true
      }
    }
    return false
  }

  /**
   * Starts the game if possible
   */
  startGame() {
    if (!this.isReady()) {
      return false
    }

    let state = startGame(this.toState())
    this.fromState(state)

    return true
  }

  /**
   * Stops the game if it's been started
   */
  stopGame() {
    if (this.status.gameStarted) {
      let state = stopGame(this.toState())
      this.fromState(state)

      return true
    }

    return false
  }

  isReady() {
    let numPlayers = 0
    for (let i in this.players) {
      if (this.players[i]) {
        numPlayers += 1
      }
    }

    if (numPlayers === this.settings.maxPlayers) {
      return true
    }

    return false
  }

  getPlayerIds() {
    let playerIds = {}
    for (let i in this.players) {
      if (this.players[i]) {
        playerIds[i] = this.players[i].id
      }
      else {
        playerIds[i] = null
      }
    }
    return playerIds
  }

  // FIXME: (Maybe) ugly
  toState() {
    let { cards, players, status, settings } = this
    let state = fromJS({
      cards: fromJS(Object(cards)),
      players: fromJS(players),
      status: fromJS(Object(status)),
      settings: fromJS(Object(settings))
    })
    return state
  }

  // FIXME: Ugly.
  fromState(state) {
    let { cards, players, status, settings } = state.toJS()
    this.cards = cards
    this.players = players
    this.status = status
    this.settings = settings
  }

  saveState(state) {
    this.readState(state)
    return this.save()
  }

  static findById(realm, _id) {
    return this.findOne({ _id, realm }).exec()
  }

}

export default Room
