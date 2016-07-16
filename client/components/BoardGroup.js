import React, {Component, PropTypes} from 'react'

import '../styles/cards.scss'

export default class BoardGroup extends Component {
  render() {
    // TODO: magic numbers are not cool, these come from cards.scss
    const numChildren = this.props.children.length
    const width = (numChildren ? 62 + (numChildren-1)*17 : 0)

    return (
      <ul className="boardGroup" style={{ width: width + 'px' }}>
        {this.props.children}
      </ul>
    )
  }
}
