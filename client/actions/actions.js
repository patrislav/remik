
import actionTypes from './actionTypes'

export function goToLobby() {
  return dispatch => {
    dispatch({
      type: actionTypes.SWITCH_SCREEN,
      screen: 'lobby'
    })
  }
}

export function receiveChatMessage(data) {
  return (dispatch, getState) => {
    let { userId, message } = data
    let user = getState().lobby.get('users').find(u => u.id === userId)
    dispatch({
      type: actionTypes.RECEIVE_MESSAGE,
      data: { user, message }
    })
  }
}

export function joinRoom(roomId) {
  return dispatch => {
    dispatch({
      type: actionTypes.lobby.JOIN_ROOM,
      roomId
    })
    dispatch({
      type: actionTypes.SWITCH_SCREEN,
      screen: 'play'
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

export function receiveRoomUsers(roomId, spectators, players) {
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
