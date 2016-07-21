import React, {Component, PropTypes} from 'react'

export default class SitDownButton extends Component {
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
      <button className="sitdownButton" onClick={this._onClick}>
        Sit here
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
