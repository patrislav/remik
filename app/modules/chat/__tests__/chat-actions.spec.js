import {
  COMPOSE_MESSAGE, composeMessage,
  ADD_MESSAGE, addMessage,
  CLEAR_CHAT, clearChat
} from '../actions'

describe('chat actions', () => {
  describe('composeMessage()', () => {
    it('returns the proper action', () => {
      const content = 'CONTENT'
      const action = { type: COMPOSE_MESSAGE, content }
      expect(composeMessage(content)).toEqual(action)
    })
  })

  describe('addMessage()', () => {
    it('returns the proper action', () => {
      const message = { id: 'ID', content: 'CONTENT', userId: 'USER_ID', timestamp: new Date() }
      const action = { type: ADD_MESSAGE, message }
      expect(addMessage(message)).toEqual(action)
    })
  })

  describe('clearChat()', () => {
    it('returns the proper action', () => {
      const action = { type: CLEAR_CHAT }
      expect(clearChat()).toEqual(action)
    })
  })
})
