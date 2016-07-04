import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class HandCard extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    deck: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state = {
      selected: false
    }
  }

  render() {
    let className = `playing-card playing-card-${this.props.code} deck-${this.props.deck}`
    let wrapperClassName = "entity hand-card-wrapper"
    if (this.state.selected) {
      wrapperClassName += " selected"
    }

    return (
      <div
        className={wrapperClassName}
        style={{ left: `${this.props.x}px` }}
        onClick={ this._onClick }
        >
        <div className={className} />
      </div>
    )
  }

  _onClick = (event) => {
    this.setState({
      selected: !this.state.selected
    })
    event.preventDefault()
  }
}
