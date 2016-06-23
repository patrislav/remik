import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(state => {
  return {
    players: state.room.get('players'),
    spectators: state.room.get('spectators')
  }
})
export default class UserList extends Component {
  render() {
    return (
      <section className="userList">
        <h3>Players</h3>
        <ul className="playerList">
          {this.userElements(this.props.players)}
        </ul>
        <h3>Spectators</h3>
        <ul className="spectatorList">
          {this.userElements(this.props.spectators)}
        </ul>
      </section>
    )
  }

  userElements(users) {
    return users.map(user =>
      <li key={user.id}>
        <span>{user.name}</span>
      </li>
    )
  }
}
