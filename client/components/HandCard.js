import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class HandCard extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    deck: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  render() {
    let className = `playing-card playing-card-${this.getCode()} deck-${this.props.deck}`
    let wrapperClassName = 'entity hand-card-wrapper'
    if (this.props.selected) {
      wrapperClassName += ' selected'
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

  getCode = () => {
    let code = this.props.code.split('.')[0]
    if (code.charAt(0) === 'X') {
      return 'X'
    }
    return code
  }

  _onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick()
    }
    event.preventDefault()
  }
}
