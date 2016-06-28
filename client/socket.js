
import io from 'socket.io-client'
import {bindActionCreators} from 'redux'

import * as Actions from './actions'

let socket, actions

class Socket {
  connect(dispatcher) {
    actions = bindActionCreators(Actions, dispatcher)
    socket = io()

    socket.on('exception', (...data) => {
      console.log('Error: ', ...data);
    })

    socket.on('me', user => {
      actions.receiveMe(user)
    })

    socket.on('lobby.users', users => {
      actions.receiveLobbyUsers(users)
    })

    socket.on('lobby.rooms', rooms => {
      actions.receiveLobbyRooms(rooms)
    })

    socket.on('room.joined', (roomId) => {
      actions.joinRoom(roomId)
    })

    socket.on('room.left', (roomId) => {
      actions.leaveRoom(roomId)
    })

    // socket.on('room.info', (table) => {
    //   let action = {
    //     type: 'table.info',
    //     table
    //   };
    //   dispatcher.handleServerAction(action);
    // });

    socket.on('room.settings', (roomId, settings) => {
      actions.receiveRoomSettings(roomId, settings)
    })

    socket.on('room.users', (roomId, users, players) => {
      actions.receiveRoomUsers(roomId, users, players)
    })

    socket.on('room.user_joined', (roomId, user) => {
      actions.receiveRoomUserJoined(roomId, user)
    })

    socket.on('room.user_left', (roomId, user) => {
      actions.receiveRoomUserLeft(roomId, user)
    })

    socket.on('chat.message', (userId, message) => {
      let data = { userId, message }
      actions.receiveChatMessage(data)
    })

    socket.on('game.user_joined', (roomId, userId, seat) => {
      actions.receiveGameUserJoined(roomId, userId, seat)
    })

    socket.on('game.user_left', (roomId, userId) => {
      actions.receiveGameUserLeft(roomId, userId)
    })

    socket.on('game.started', (roomId, status) => {
      actions.receiveGameStarted(roomId, status)
    })

    socket.on('game.stopped', (roomId, status) => {
      actions.receiveGameStopped(roomId, status)
    })
  }

  get socket() {
    return socket
  }
}

const instance = new Socket()
export default instance
