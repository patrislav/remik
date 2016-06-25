import React, {Component, PropTypes} from 'react'

import RoomListItem from './RoomListItem'

export default class RoomList extends Component {

  render() {
    let roomElements = []
    for (let room of this.props.rooms) {
      roomElements.push(
        <RoomListItem
          key={room.id}
          room={room}
          joinRoom={this.props.onJoin(room)}
        />
      )
    }

    return (
      <section className='roomList'>
        <h3>Tables</h3>
        <button onClick={this.props.onCreate}>Create table</button>
        <ul>
          {roomElements}
        </ul>
      </section>
    )
  }
}
