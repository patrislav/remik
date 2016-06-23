import React, {Component, PropTypes} from 'react'

import io from '../socket'

import RoomListItem from './RoomListItem'

export default class RoomList extends Component {

  render() {
    let roomElements = []
    for (let room of this.props.rooms) {
      roomElements.push(
        <RoomListItem
          key={room.id}
          room={room}
          joinRoom={this._joinRoom(room)}
        />
      )
    }

    return (
      <section className='roomList'>
        <h3>Tables</h3>
        <button onClick={this._createRoom}>Create table</button>
        <ul>
          {roomElements}
        </ul>
      </section>
    )
  }

  _createRoom = (event) => {
    io.socket.emit('room.create')
    event.preventDefault()
  }

  _joinRoom = (room) => {
    return event => {
      io.socket.emit('room.join', room.id)
      event.preventDefault()
    }
  }
}
