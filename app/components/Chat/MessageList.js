import React, {PropTypes} from 'react'

const propTypes = {
  messages: PropTypes.array
}

const defaultProps = {
  messages: []
}

const MessageList = ({ messages }) => (
  <ul>
    {messages.map((message, i) =>
      <li key={i}>{message}</li>
    )}
  </ul>
)

MessageList.propTypes = propTypes
MessageList.defaultProps = defaultProps

export default MessageList
