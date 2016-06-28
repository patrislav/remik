
import { model, index } from 'mongoose-decorators'
import User from './user'
// TODO: Move this file into common directory
import {phases} from '../../client/constants'

const PLAYER_COLOURS = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan']

@model({
  realm: { type: String },
  settings: {
    maxPlayers: { type: Number, default: 2 },
    jokersPerDeck: { type: Number, default: 1 },
    deckCount: { type: Number, default: 2 },
    deckBack: { type: String, default: "classic" },
    deckFront: { type: String, default: "classic" },
    turnTime: { type: Number, default: 0 }
  },
  status: {
    currentPlayer: { type: String, default: null },
    phase: { type: String, default: phases.WAITING_FOR_PLAYERS },
    turnStartedAt: { type: Date, default: null },
    gameStarted: { type: Boolean, default: false }
  },
  users: { type: [String], default: [] },
  players: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  creatorId: { type: String, default: null }
})
@index({ realm: 1 })
class Room {

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

    this.removePlayer(userId)

    if (this.users.length <= 0) {
      this.remove()
      return false
    }

    return true
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
      if (this.players[i] === userId) {
        return false
      }
    }

    if (this.players.hasOwnProperty(seat) && !this.players[seat]) {
      this.addUser(userId)
      this.players[seat] = userId
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
      if (this.players.hasOwnProperty(key) && this.players[key] === userId) {
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

    this.status.gameStarted = true
    this.status.phase = phases.CARD_TAKING
    this.status.currentPlayer = randomSeat(this.players)
    this.status.turnStartedAt = Date.now()

    return true
  }

  /**
   * Stops the game if it's been started
   */
  stopGame() {
    if (this.status.gameStarted) {
      this.status.gameStarted = false
      this.status.phase = phases.WAITING_FOR_PLAYERS
      this.status.currentPlayer = null
      this.status.turnStartedAt = null

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

  // isPlayer(userId) {
  //   return Object.values(this.players).includes(userId)
  // }

  static findById(realm, _id) {
    return this.findOne({ _id, realm }).exec()
  }

}

function randomSeat(players) {
  let seats = Object.keys(players)
  return seats[Math.floor(Math.random() * seats.length)]
}

export default Room
