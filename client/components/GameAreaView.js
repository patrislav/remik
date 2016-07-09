import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {phases} from '../../common/constants'
import {checkGroupValidity} from '../../common/validators'

import StockPile from './StockPile'
import DiscardPile from './DiscardPile'
import GroupAdder from './GroupAdder'
import BoardGroup from './BoardGroup'
import BoardCard from './BoardCard'

// Helper function
const getCode = x => x.get('code')

@connect(state => {
  return {
    gameStarted: state.game.getIn(['status', 'gameStarted']),
    phase: state.game.getIn(['status', 'phase']),
    stock: state.game.getIn(['cards', 'stock']),
    discard: state.game.getIn(['cards', 'discard']),
    board: state.game.getIn(['cards', 'board']),
    hand: state.game.get('hand'),
    isCurrent: state.game.getIn(['status', 'currentPlayer']) === state.game.get('seat')
  }
})
export default class GameAreaView extends Component {
  render() {
    if (this.props.gameStarted) {
      return (
        <div className="gameAreaView">
          <StockPile
            deck="classic"
            back="blue"
            numCards={this.props.stock}
            onClick={this._onClickStock}
            highlight={this.props.phase == phases.CARD_TAKING && this.props.isCurrent}
            />
          <DiscardPile
            deck="classic"
            lastCard={this.props.discard}
            onClick={this._onClickDiscard}
            highlight={this.canDiscard()}
            />
          { this.renderGroups() }
          { this.canAddGroup() && <GroupAdder canAdd={this.canAddGroup()} onClick={this._onAddGroup} /> }
        </div>
      )
    }
    else {
      return <div className="gameAreaView"></div>
    }

  }

  renderGroups() {
    let groups = this.props.board.map((group, index) => {
      let cards = group.map(code => <BoardCard key={code} code={code} deck="classic" />).toJS()
      return <BoardGroup key={index}>{cards}</BoardGroup>
    })
    return groups.toJS()
  }

  _onClickStock = () => {
    if (this.props.phase == phases.CARD_TAKING && this.props.isCurrent) {
      this.props.onDrawFromStock()
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

  _onAddGroup = () => {
    if (this.canAddGroup()) {
      this.props.onMeldNewGroup(this.getSelected().map(getCode).toJS())
    }
  }

  canAddGroup = () => {
    return this.isValidGroup() && this.props.phase == phases.BASE_TURN && this.props.isCurrent
  }

  canDiscard = () => {
    return this.props.phase == phases.BASE_TURN && this.getSelected().size == 1
  }

  isValidGroup = () => {
    return checkGroupValidity(this.getSelected().map(getCode).toJS()).valid
  }

  getSelected = () => {
    return this.props.hand.filter(card => card.get('selected'))
  }

}
