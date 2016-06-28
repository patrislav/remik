
import actionTypes from './actionTypes'
import {getUser} from '../helpers'

export function goToLobby() {
  return dispatch => {
    dispatch({
      type: actionTypes.SWITCH_SCREEN,
      screen: 'lobby'
    })
  }
}

export function receiveMe(user) {
  return dispatch => {
    dispatch({
      type: actionTypes.RECEIVE_ME,
      user
    })
  }
}

export function receiveChatMessage(data) {
  return (dispatch, getState) => {
    let { userId, message } = data
    let user = getUser(getState(), userId)
    dispatch({
      type: actionTypes.RECEIVE_MESSAGE,
      data: { user, message }
    })
  }
}

export function joinRoom(roomId) {
  return dispatch => {
    dispatch({
      type: actionTypes.room.JOIN,
      roomId
    })
    dispatch({
      type: actionTypes.SWITCH_SCREEN,
      screen: 'play'
    })
  }
}

export function leaveRoom(roomId) {
  return dispatch => {
    dispatch({
      type: actionTypes.room.LEAVE,
      roomId
    })
    dispatch({
      type: actionTypes.SWITCH_SCREEN,
      screen: 'lobby'
    })
  }
}

export function receiveLobbyRooms(rooms) {
  return dispatch => {
    dispatch({
      type: actionTypes.lobby.RECEIVE_ROOMS,
      rooms
    })
  }
}

export function receiveLobbyUsers(users) {
  return dispatch => {
    dispatch({
      type: actionTypes.lobby.RECEIVE_USERS,
      users
    })
  }
}

export function receiveLobbyFriends(friends) {
  return dispatch => {
    dispatch({
      type: actionTypes.lobby.RECEIVE_FRIENDS,
      friends
    })
  }
}

export function receiveRoomSettings(roomId, settings) {
  return dispatch => {
    dispatch({
      type: actionTypes.room.ROOM_SETTINGS,
      roomId, settings
    })
  }
}

/**
 * Receive the room users via socket
 *
 * @param {string} roomId
 * @param {User[]} users
 * @param {object} players - In the format of { seat: userId }
 */
export function receiveRoomUsers(roomId, users, players) {
  let spectators = users
  for (let i in players) {
    let j = spectators.findIndex(u => u.id === players[i])
    if (spectators[j]) {
      players[i] = spectators[j]
      spectators.splice(j, 1)
    }
  }

  return dispatch => {
    dispatch({
      type: actionTypes.room.RECEIVE_USERS,
      roomId, spectators, players
    })
  }
}

export function receiveRoomUserJoined(roomId, user) {
  return dispatch => {
    dispatch({
      type: actionTypes.room.USER_JOINED,
      roomId, user
    })
  }
}

export function receiveRoomUserLeft(roomId, user) {
  return dispatch => {
    dispatch({
      type: actionTypes.room.USER_LEFT,
      roomId, user
    })
  }
}

export function receiveGameUserJoined(roomId, userId, seat) {
  return (dispatch, getState) => {
    let user = getUser(getState(), userId)
    dispatch({
      type: actionTypes.game.USER_JOINED,
      roomId, user, seat
    })
  }
}

export function receiveGameUserLeft(roomId, userId) {
  return dispatch => {
    dispatch({
      type: actionTypes.game.USER_LEFT,
      roomId, userId
    })
  }
}

export function receiveGameStarted(roomId, status) {
  return dispatch => {
    dispatch({
      type: actionTypes.game.STARTED,
      roomId, status
    })
  }
}

export function receiveGameStopped(roomId, status) {
  return dispatch => {
    dispatch({
      type: actionTypes.game.STOPPED,
      roomId, status
    })
  }
}
