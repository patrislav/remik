import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class BoardGroup extends Component {
  render() {
    // TODO: magic numbers are not cool, these come from cards.scss
    const numChildren = this.props.children.length
    const width = (numChildren ? 62 + (numChildren-1)*17 : 0)

    let className = "boardGroup"
    if (this.props.canClick) {
      className += " group-highlight"
    }

    return (
      <ul className={className} style={{ width: width + 'px' }} onClick={this._onClick}>
        {this.props.children}
      </ul>
    )
  }

  _onClick = (event) => {
    if (this.props.onClick && this.props.canClick) {
      this.props.onClick()
    }
    event.preventDefault()
  }
}
