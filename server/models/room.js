
import { model, index } from 'mongoose-decorators';
import User from './user';

const PLAYER_COLOURS = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan'];

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
    return this._id;
  }

  toJSON() {
    let { id } = this;
    return { id };
  }

  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
    }
  }

  removeUser(userId) {
    let index = this.users.indexOf(userId);
    if (index > -1) {
      this.users.splice(index, 1);
    }

    this.removePlayer(userId);
  }

  addPlayer(userId) {
    for (let key in this.players) {
      if (this.players.hasOwnProperty(key) && this.players[key] === userId) {
        return false;
      }
    }

    this.addUser(userId);

    for (let key of PLAYER_COLOURS) {
      if (!this.players.hasOwnProperty(key)) {
        this.players[key] = userId;
        return true;
      }
    }

    // If we reached this point, all player seats are already taken
    return false;
  }

  removePlayer(userId) {
    for (let key in this.players) {
      if (this.players.hasOwnProperty(key) && this.players[key] === userId) {
        delete this.players[key];
      }
    }
  }

  static findById(realm, _id) {
    return this.findOne({ _id, realm }).exec();
  }

}

export default Room;
