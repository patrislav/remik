import React, {Component, PropTypes} from 'react'

export default class BoardGroup extends Component {
  render() {
    return (
      <div className="boardGroup">
        {this.props.children}
      </div>
    )
  }
}
