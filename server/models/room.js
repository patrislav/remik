
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
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
  playerIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  createdAt: { type: Date, default: Date.now },
  creatorId: { type: mongoose.Schema.Types.ObjectId, default: null }
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
