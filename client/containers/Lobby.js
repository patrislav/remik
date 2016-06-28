import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import io from '../socket'
import * as Actions from '../actions'

import FriendList from '../components/lobby/FriendList'
import RoomList from '../components/lobby/RoomList'

@connect(state => {
  return {
    friends: state.lobby.get('friends'),
    rooms: state.lobby.get('rooms')
  }
})
export default class Lobby extends Component {
  /**
   * On class initialization bind all the actions to the dispatch function.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props)
    this.actions = bindActionCreators(Actions, this.props.dispatch)
  }

  componentDidMount() {
    FB.api('/me/invitable_friends', (response) => {
      this.actions.receiveLobbyFriends(response.data)
    })
  }

  /**
   * Expected context object types.
   */
  static childContextTypes = {
    actions: PropTypes.object
  }

  /**
   * Getter for the child context object.
   */
  getChildContext() {
    return {
      actions: this.actions
    }
  }

  render() {
    return (
      <div className='lobby'>
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
