import React, {Component, PropTypes} from 'react'

export default class StandUpButton extends Component {
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
      <button className="standupButton" onClick={this._onClick}>
        Stand up
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
