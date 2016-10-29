import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Immutable from 'immutable'

import io from '../socket'
import * as Actions from '../actions'

import UserList from '../components/room/UserList'
import Chat from '../components/chat'
import GameView from '../components/GameView'

@connect(state => ({
  user: state.game.get('user'),
  players: state.room.get('players').toJS(),
  playerCards: state.game.getIn(['cards', 'players']).toJS(),
  currentPlayer: state.game.getIn(['status', 'currentPlayer']),
  typingUserTimes: state.chat.get('typingUserTimes')
}))
export default class Play extends Component {
  /**
   * On class initialization bind all the actions to the dispatch function.
   *
   * @param {Object} props Component properties
   */
  constructor(props) {
    super(props)
    this.actions = bindActionCreators(Actions, this.props.dispatch)
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    user: PropTypes.object,
    players: PropTypes.object,
    playerCards: PropTypes.object,
    currentPlayer: PropTypes.string,
    typingUserTimes: PropTypes.instanceOf(Immutable.Map)
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
      <div className="play">
        <aside>
          <UserList
            players={this.props.players}
            playerCards={this.props.playerCards}
            onSitDown={this._onSitDown}
            onStandUp={this._onStandUp}
            onLeave={this._onLeave}
            currentlySitting={this.isSitting()}
            currentPlayer={this.props.currentPlayer}
            />
          <Chat
            onTyping={this._onChatTyping}
            onMessage={this._onChatMessage}
            />
        </aside>
        <main>
          <GameView
            onDrawFromStock={this._onDrawFromStock}
            onDrawFromDiscard={this._onDrawFromDiscard}
            onDiscard={this._onDiscard}
            onSelectHandCard={this._onSelectHandCard}
            onMoveHandCard={this._onMoveHandCard}
            onMeldNewGroup={this._onMeldNewGroup}
            onMeldExisting={this._onMeldExisting}
            onTakeJoker={this._onTakeJoker}
            onUndoLast={this._onUndoLast}
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

  _onMoveHandCard = (dragIndex, hoverIndex) => {
    this.actions.moveHandCard(dragIndex, hoverIndex)
  }

  _onMeldNewGroup = (cards) => {
    io.socket.emit('game.meld_new', cards)
  }

  _onMeldExisting = (group, cards) => {
    io.socket.emit('game.meld_existing', group, cards)
  }

  _onTakeJoker = (group) => {
    io.socket.emit('game.take_joker', group)
  }

  _onUndoLast = () => {
    io.socket.emit('game.undo_last')
  }

  _onChatTyping = () => {
    const then = this.props.typingUserTimes.get(this.props.user.id)
    if (!then || Date.now() - then > 1000) {
      io.socket.emit('chat.typing')
      this.actions.receiveChatTyping(this.props.user.id, Date.now())
    }
  }

  _onChatMessage = (message) => {
    io.socket.emit('chat.message', message)
  }
}
