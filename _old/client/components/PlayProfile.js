import React, {Component, PropTypes} from 'react'
import {getProfilePictureUrl} from '../helpers'

export default class PlayProfile extends Component {
  /**
   * Expected properties object types.
   */
  static propTypes = {
    onClick: PropTypes.func,
    user: PropTypes.object,
    numCards: PropTypes.number,
    isCurrent: PropTypes.bool
  }

  static defaultProps = {
    onClick: () => {},
    user: null,
    numCards: -1,
    isCurrent: false
  }

  render() {
    return (
      <div className="playProfile">
        <img src={getProfilePictureUrl(this.props.user)} />
        <span>{this.showNumCards()}</span>
        {this.props.isCurrent && ' <--'}
      </div>
    )
  }

  _onClick = (event) => {
    this.props.onClick()
    event.preventDefault()
  }

  showNumCards = () => {
    return (this.props.numCards >= 0 ? this.props.numCards : '')
  }
}
