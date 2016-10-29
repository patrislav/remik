/* eslint-disable react/no-danger */

import React, {Component, PropTypes} from 'react'
import Emoji from '../../lib/emoji'

export default class MessageView extends Component {
  static propTypes = {
    message: PropTypes.string,
    user: PropTypes.object,
    code: PropTypes.string,
    isCurrentUser: PropTypes.bool
  }

  senderName = () => {
    if (this.props.message && this.props.user && this.props.user.firstName) {
      return { __html: '&lt;' + this.props.user.firstName + '&gt;' }
    }
    else {
      return { __html: '*' }
    }
  }

  rawMarkup = () => {
    let message = ''
    if (this.props.message) {
      message = Emoji.parse(this.props.message)
    }
    else {
      switch (this.props.code) {
      case 'user_joined_playing':
        message = `${this.props.user.name} is now playing.`
        break
      case 'user_joined_spectating':
        message = `${this.props.user.name} joined the table as spectator.`
        break
      case 'user_left':
        message = `${this.props.user.name} left the table.`
        break
      }
    }
    return { __html: message }
  }

  render() {
    return (
      <li style={ this.props.isCurrentUser ? {fontWeight: 'bold'} : {} }>
        <span dangerouslySetInnerHTML={this.senderName()}></span>
        {' '}
        <span dangerouslySetInnerHTML={this.rawMarkup()}></span>
      </li>
    )
  }


}
