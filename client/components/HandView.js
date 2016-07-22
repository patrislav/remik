import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import HandCard from './HandCard'
import UndoLastButton from './UndoLastButton'

@connect(state => ({
  cards: state.game.get('hand').toJS()
}))
export default class HandView extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelectHandCard: PropTypes.func.isRequired,
    onUndoLast: PropTypes.func.isRequired
  }

  render() {
    let areaWidth = 550,
      gutterWidth = 25,
      cardWidth = 100,
      handWidth = cardWidth + (this.props.cards.length-1) * gutterWidth,
      offset = (areaWidth - handWidth) / 2

    let cardElements = this.props.cards.map(
      (card, index) => <HandCard
        key={index}
        deck="classic"
        code={card.code}
        x={offset + parseInt(index) * gutterWidth}
        onClick={this._onClickCard(card.code)}
        selected={card.selected}
      />
    )

    return (
      <div className="handView">
        <div>
          <UndoLastButton
            onClick={this._onUndoLast}
          />
        </div>
        {cardElements}
      </div>
    )
  }

  _onClickCard = (cardCode) => {
    return () => {
      this.props.onSelectHandCard(cardCode)
    }
  }

  _onUndoLast = () => {
    this.props.onUndoLast()
  }
}
