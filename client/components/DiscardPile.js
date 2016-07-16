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
    if (this.props.lastCard) {
      let className = `playing-card playing-card-${this.getLastCardCode()} deck-${this.props.deck}`,
        wrapperClassName = "entity pile-card-wrapper"

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
    return <div></div>
  }

  getLastCardCode = () => {
    let code = this.props.lastCard.split('.')[0]
    if (code.charAt(0) === 'X') {
      return 'X'
    }
    return code
  }

  _onClick = (event) => {
    if (this.props.onClick) this.props.onClick()
    event.preventDefault()
  }
}
