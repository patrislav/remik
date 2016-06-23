import React, {Component, PropTypes} from 'react';

export default class RoomListItem extends Component {
  render() {
    return (
      <li>
        <span>Table {this.props.room.id}</span>
        {' | '}
        <a href="#" onClick={this.props.joinRoom}>Join</a>
      </li>
    )
  }
}
