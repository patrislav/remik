import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class DiscardPile extends Component {
  static propTypes = {
    deck: PropTypes.string.isRequired,
    // numCards: PropTypes.number,
    lastCard: PropTypes.string,
    onClick: PropTypes.func,
    highlight: PropTypes.bool
  }

  render() {
    let className = `playing-card playing-card-${this.props.lastCard} deck-${this.props.deck}`,
      wrapperClassName = "entity table-card-wrapper"

    if (this.props.highlight) {
      wrapperClassName += " pile-highlight"
    }

    return (
      <div
        className={wrapperClassName}
        onClick={this._onClick}
        >
        <div className={className} />
        {/*<span>{this.props.numCards}</span>*/}
      </div>
    )
  }

  _onClick = (event) => {
    if (this.props.onClick) this.props.onClick()
    event.preventDefault()
  }
}
