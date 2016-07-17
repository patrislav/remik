import React, {Component, PropTypes} from 'react'
import s from './styles.scss'

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
      <button className={s.groupAdder} onClick={this._onClick}>
        <span className={s.plus}>+</span>
        <span className={s.subtext}>Meld</span>
      </button>
    )
  }

  _onClick = (event) => {
    if (this.props.onClick) this.props.onClick(event)
    event.preventDefault()
  }
}
