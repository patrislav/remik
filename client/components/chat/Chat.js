import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import MessageComposer from './MessageComposer'
import MessageView from './MessageView'

@connect(state => ({
  messages: state.chat.get('messages')
}))
export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentDidUpdate() {
    this._scrollToBottom()
  }

  render() {
    let messageElements = [], messages = this.props.messages
    for (let i in messages) {
      messageElements.push(
        <MessageView
          key={i}
          user={messages[i].user}
          message={messages[i].message}
          code={messages[i].code}
        />
      )
    }

    return (
      <section className="chat">
        <div className="content">
          <ul className="messageList" ref="messageList">
            {messageElements}
            {/*<TypingIndicator users={this.state.typingUsers} />*/}
          </ul>
          <MessageComposer />
        </div>
      </section>
    )
  }

  _scrollToBottom = () => {
    let ul = this.refs.messageList
    ul.scrollTop = ul.scrollHeight
  }
}
