import React, {PropTypes} from 'react'
import styles from './MessageList.css'

const propTypes = {
  messages: PropTypes.array
}

const defaultProps = {
  messages: []
}

const MessageList = ({ messages }) => (
  <ul className={styles.list}>
    {messages.map((message, i) =>
      <li key={i} className={styles.item}>{message}</li>
    )}
  </ul>
)

MessageList.propTypes = propTypes
MessageList.defaultProps = defaultProps

export default MessageList
