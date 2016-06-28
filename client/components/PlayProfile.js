import React, {Component, PropTypes} from 'react'
import {getProfilePictureUrl} from '../helpers'

export default class PlayProfile extends Component {
  /**
   * Expected properties object types.
   */
  static propTypes = {
    onClick: PropTypes.func,
    user: PropTypes.object,
    numCards: PropTypes.number
  }

  static defaultProps = {
    onClick: () => {},
    user: null,
    numCards: 0
  }

  render() {
    return (
      <div className="playProfile"><img src={getProfilePictureUrl(this.props.user)} /></div>
    )
  }

  _onClick = (event) => {
    this.props.onClick()
    event.preventDefault()
  }
}
