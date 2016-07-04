
export default {
  SWITCH_SCREEN: 'switchScreen',

  RECEIVE_MESSAGE: 'receiveMessage',
  RECEIVE_ME: 'receiveMe',

  lobby: {
    RECEIVE_ROOMS: 'lobby.receiveRooms',
    RECEIVE_USERS: 'lobby.receiveUsers',
    RECEIVE_FRIENDS: 'lobby.receiveFriends'
  },

  room: {
    RECEIVE_USERS: 'room.receiveUsers',
    USER_JOINED: 'room.userJoined',
    USER_LEFT: 'room.userLeft',
    ROOM_SETTINGS: 'room.settings',
    JOIN: 'room.join',
    LEAVE: 'room.leave'
  },

  game: {
    USER_JOINED: 'game.userJoined',
    USER_LEFT: 'game.userLeft',
    COUNTDOWN_STARTED: 'game.countdownStarted',
    COUNTDOWN_STOPPED: 'game.countdownStopped',
    STARTED: 'game.started',
    STOPPED: 'game.stopped',
    STATUS: 'game.status',
    HAND: 'game.hand',
    CARDS: 'game.cards'
  }
}
