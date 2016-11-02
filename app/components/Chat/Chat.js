import React, {PropTypes} from 'react'
import {connect} from '../../lib/rxstate'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'
import {compose$} from '../../modules/chat/actions'
import {selectMessagesWithAuthors} from '../../modules/chat/selectors'
import styles from './Chat.css'

const propTypes = {
  onCompose: PropTypes.func,
  messages: PropTypes.array
}

const defaultProps = {
  onCompose: () => {},
  messages: []
}

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

export default connect(state => ({
  messages: selectMessagesWithAuthors(state),
  onCompose: content => compose$.next({ userId: 'me', content }),
}))(Chat)
