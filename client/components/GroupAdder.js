import React, {Component, PropTypes} from 'react'

export default class GroupAdder extends Component {
  /**
   * Expected properties object types.
   */
  static propTypes = {
    canAdd: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render() {
    return (
      <button className="groupAdder" onClick={this._onClick} style={{ height: '60px' }}>
        Meld!
      </button>
    )
  }

  _onClick = (event) => {
    if (this.props.onClick) this.props.onClick(event)
    event.preventDefault()
  }
}
