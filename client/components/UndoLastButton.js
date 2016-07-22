import React, {Component, PropTypes} from 'react'

export default class UndoLastButton extends Component {
  /**
   * Expected properties object types.
   */
  static propTypes = {
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render() {
    return (
      <button className="undoLastButton" onClick={this._onClick}>
        Undo
      </button>
    )
  }

  _onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }
    event.preventDefault()
  }
}
