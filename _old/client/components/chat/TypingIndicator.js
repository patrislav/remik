/* eslint-disable react/no-danger */
import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'

export default class MessageView extends Component {
  static propTypes = {
    users: PropTypes.instanceOf(Immutable.List)
  }

  // FIXME: Is it just me or this whole thing is ugly?
  render() {
    const users = this.props.users

    if (users.isEmpty()) {
      return null
    }

    let typingText = ''
    if (users.size === 1) {
      const user = users.first()
      typingText = `${user.firstName} is typing...`
    }
    else {
      typingText += users.reduce((text, user, i) => {
        text += user.firstName
        if (i < users.size-2) {
          return text + ', '
        }
        else if (i === users.size-1) {
          return text + ' and '
        }
        return text
      }, '')
      typingText += ' are typing...'
    }

    return <li style={{ fontStyle: 'italic' }}>{typingText}</li>
  }


}
