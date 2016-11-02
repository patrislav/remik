
export const selectMessagesWithAuthors = (state) =>
  state.chat.messages && state.chat.messages.map(message =>
    ({ ...message, author: state.users[message.userId].firstName })
  )
