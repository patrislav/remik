export const COMPOSE_MESSAGE = 'chat/COMPOSE_MESSAGE'
export const ADD_MESSAGE = 'chat/ADD_MESSAGE'
export const CLEAR_CHAT = 'chat/CLEAR_CHAT'

export const composeMessage = content => ({ type: COMPOSE_MESSAGE, content })
export const addMessage = message => ({ type: ADD_MESSAGE, message })
export const clearChat = () => ({ type: CLEAR_CHAT })
