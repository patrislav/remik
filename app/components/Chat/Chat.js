import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'
import {composeMessage} from '../../modules/chat'
import {selectMessagesWithAuthors} from '../../modules/chat/selectors'

import styles from './Chat.css'

const propTypes = {
  onCompose: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }))
}

const defaultProps = {
  onCompose: () => {},
  messages: []
}

const mapStateToProps = state => ({
  messages: selectMessagesWithAuthors(state)
})

const mapDispatchToProps = dispatch => ({
  onCompose: content => dispatch(composeMessage(content))
})

export const Chat = ({ onCompose, messages }) => (
  <section className={styles.chat}>
    <div className={styles.listWrapper}>
      <MessageList messages={messages} />
    </div>
    <div className={styles.composerWrapper}>
      <MessageComposer onCompose={onCompose} />
    </div>
  </section>
)

Chat.propTypes = propTypes
Chat.defaultProps = defaultProps

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
