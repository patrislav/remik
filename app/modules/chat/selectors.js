
export const selectMessagesWithAuthors = ({ chat, users }) =>
  chat.messages && chat.messages.map(message =>
    ({ ...message, author: users[message.userId].firstName })
  )
