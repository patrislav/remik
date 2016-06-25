import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import io from '../socket'
import * as Actions from '../actions'

import UserList from '../components/room/UserList'
import Chat from '../components/chat'
import GameView from '../components/GameView'

@connect(state => {
  return {
    players: state.room.get('players')
  }
})
export default class Play extends Component {
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
      <div className='play'>
        <aside>
          <UserList
            players={this.props.players}
            onSit={this._onSit}
            />
          <Chat />
        </aside>
        <main>
          <GameView />
        </main>
      </div>
    )
  }

  _onSit = (seat) => {
    return event => {
      io.socket.emit('game.join', seat)
      event.preventDefault()
    }
  }
}
