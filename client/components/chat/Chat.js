import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import {getTypingUsers} from '../../helpers'

import MessageComposer from './MessageComposer'
import MessageView from './MessageView'
import TypingIndicator from './TypingIndicator'

@connect(state => ({
  messages: state.chat.get('messages'),
  typingUsers: getTypingUsers(state),
  typingUpdatedAt: state.chat.get('typingUpdatedAt')
}))
export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.instanceOf(Immutable.List).isRequired,
    typingUsers: PropTypes.instanceOf(Immutable.List).isRequired,
    onTyping: PropTypes.func,
    onMessage: PropTypes.func,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      typingUsers: this.props.typingUsers
    }
  }

  componentDidUpdate() {
    this._scrollToBottom()
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.dispatch({ type: 'chat.typingUpdate' })
    }, 400)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <section className="chat">
        <div className="content">
          <ul className="messageList" ref="messageList">
            {this.props.messages.map((message, i) =>
              <MessageView
                key={i}
                user={message.user}
                message={message.message}
                code={message.code}
                />
            )}
            {<TypingIndicator users={this.props.typingUsers} />}
          </ul>
          <MessageComposer
            onChange={this.props.onTyping}
            onSubmit={this.props.onMessage}
            />
        </div>
      </section>
    )
  }

  _scrollToBottom = () => {
    let ul = this.refs.messageList
    ul.scrollTop = ul.scrollHeight
  }
}
