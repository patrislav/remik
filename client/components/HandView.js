import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import HandCard from './HandCard'

@connect(state => {
  return {
    cards: state.game.get('hand')
  }
})
export default class HandView extends Component {
  render() {
    let areaWidth = 550,
      gutterWidth = 25,
      cardWidth = 100,
      handWidth = cardWidth + (this.props.cards.length-1) * gutterWidth,
      offset = (areaWidth - handWidth) / 2

    let cardElements = this.props.cards.map(
      (code, index) => <HandCard
        key={index}
        deck="classic"
        code={code}
        x={offset + parseInt(index) * gutterWidth}
      />
    )

    return (
      <div className="handView">
        {cardElements}
      </div>
    )
  }
}
