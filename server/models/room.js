
import { model, index } from 'mongoose-decorators'
import User from './user'

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
    currentPlayer: { type: Number, default: null },
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

  static findById(realm, _id) {
    return this.findOne({ _id, realm }).exec()
  }

}

export default Room
