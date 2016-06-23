import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../actions'

import UserList from '../components/UserList'
import RoomList from '../components/RoomList'

@connect(state => {
  return {
    users: state.lobby.get('users'),
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
          <UserList users={this.props.users} />
        </aside>
        <main>
          <RoomList rooms={this.props.rooms} />
        </main>
      </div>
    )
  }
}
