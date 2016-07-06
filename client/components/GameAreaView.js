import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {phases} from '../constants'

import StackPile from './StackPile'
import DiscardPile from './DiscardPile'

@connect(state => {
  return {
    gameStarted: state.game.getIn(['status', 'gameStarted']),
    phase: state.game.getIn(['status', 'phase']),
    stack: state.game.getIn(['cards', 'stack']),
    discard: state.game.getIn(['cards', 'discard']),
    hand: state.game.get('hand'),
    isCurrent: state.game.getIn(['status', 'currentPlayer']) === state.game.get('seat')
  }
})
export default class GameAreaView extends Component {
  render() {
    if (this.props.gameStarted) {
      return (
        <div className="gameAreaView">
          <StackPile
            deck="classic"
            back="blue"
            numCards={this.props.stack}
            onClick={this._onClickStack}
            highlight={this.props.phase == phases.CARD_TAKING && this.props.isCurrent}
            />
          <DiscardPile
            deck="classic"
            lastCard={this.props.discard}
            onClick={this._onClickDiscard}
            highlight={this.canDiscard()}
            />
        </div>
      )
    }
    else {
      return <div className="gameAreaView"></div>
    }

  }

  _onClickStack = () => {
    if (this.props.phase == phases.CARD_TAKING && this.props.isCurrent) {
      this.props.onDrawFromStack()
    }
  }

  _onClickDiscard = () => {
    if (this.props.phase == phases.CARD_TAKING && this.props.isCurrent) {
      // this.props.onDrawFromDiscard()
    }
    else if (this.canDiscard()) {
      this.props.onDiscard(this.getSelected().first().get('code'))
    }
  }

  canDiscard = () => {
    console.log(this.getSelected().toJS())
    return this.props.phase == phases.BASE_TURN && this.getSelected().size == 1
  }

  getSelected = () => {
    return this.props.hand.filter(card => card.get('selected'))
  }

}
