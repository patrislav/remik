import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class BoardCard extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    deck: PropTypes.string.isRequired
  }

  render() {
    let className = `playing-card playing-card-${this.getCode()} deck-${this.props.deck}`
    let wrapperClassName = "entity table-card-wrapper"

    return (
      <li
        className={wrapperClassName}
        >
        <div className={className} />
      </li>
    )
  }

  getCode = () => {
    let code = this.props.code.split('.')[0]
    if (code.charAt(0) === 'X') {
      return 'X'
    }
    return code
  }
}
