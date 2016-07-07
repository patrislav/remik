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
    user: state.game.get('user'),
    players: state.room.get('players').toJS(),
    playerCards: state.game.getIn(['cards', 'players']).toJS()
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
            playerCards={this.props.playerCards}
            onSitDown={this._onSitDown}
            onStandUp={this._onStandUp}
            onLeave={this._onLeave}
            currentlySitting={this.isSitting()}
            />
          <Chat />
        </aside>
        <main>
          <GameView
            onDrawFromStock={this._onDrawFromStock}
            onDrawFromDiscard={this._onDrawFromDiscard}
            onDiscard={this._onDiscard}
            onSelectHandCard={this._onSelectHandCard}
            />
        </main>
      </div>
    )
  }

  isSitting = () => {
    for (let i of Object.keys(this.props.players)) {
      if (this.props.players[i] && this.props.players[i].id === this.props.user.id) {
        return true
      }
    }
    return false
  }

  _onSitDown = (seat) => {
    return event => {
      io.socket.emit('game.join', seat)
      event.preventDefault()
    }
  }

  _onStandUp = (event) => {
    io.socket.emit('game.leave')
    event.preventDefault()
  }

  _onLeave = (event) => {
    io.socket.emit('room.leave')
    event.preventDefault()
  }

  _onDrawFromStock = () => {
    io.socket.emit('game.draw_card', 'stock')
  }

  _onDrawFromDiscard = () => {
    io.socket.emit('game.draw_card', 'discard')
  }

  _onDiscard = (code) => {
    io.socket.emit('game.discard', code)
  }

  _onSelectHandCard = (code) => {
    this.actions.selectHandCard(code)
  }
}
