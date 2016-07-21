import React, {Component, PropTypes} from 'react'

export default class LeaveRoomButton extends Component {
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
      <button className="leaveroomButton" onClick={this._onClick}>
        Leave the table
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
