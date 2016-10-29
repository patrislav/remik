import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import io from '../socket'
import * as Actions from '../actions'

import FriendList from '../components/lobby/FriendList'
import RoomList from '../components/lobby/RoomList'

@connect(state => ({
  friends: state.lobby.get('friends'),
  rooms: state.lobby.get('rooms')
}))
export default class Lobby extends Component {
  /**
   * On class initialization bind all the actions to the dispatch function.
   *
   * @param {Object} props Component properties
   */
  constructor(props) {
    super(props)
    this.actions = bindActionCreators(Actions, this.props.dispatch)
  }

  componentDidMount() {
    /* global FB */
    FB.api('/me/invitable_friends', (response) => {
      this.actions.receiveLobbyFriends(response.data)
    })
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    friends: PropTypes.arrayOf(PropTypes.object).isRequired,
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  /**
   * Expected context object types.
   */
  static childContextTypes = {
    actions: PropTypes.object
  }

  /**
   * Getter for the child context object.
   *
   * @return {object} context
   */
  getChildContext() {
    return {
      actions: this.actions
    }
  }

  render() {
    return (
      <div className="lobby">
        <aside>
          <FriendList users={this.props.friends} />
        </aside>
        <main>
          <RoomList
            rooms={this.props.rooms}
            onJoin={this._onJoinRoom}
            onCreate={this._onCreateRoom}
            />
        </main>
      </div>
    )
  }

  _onCreateRoom = (event) => {
    io.socket.emit('room.create')
    event.preventDefault()
  }

  _onJoinRoom = (room) => {
    return event => {
      io.socket.emit('room.join', room.id)
      event.preventDefault()
    }
  }
}
