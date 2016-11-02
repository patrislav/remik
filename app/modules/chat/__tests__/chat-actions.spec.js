import {createMockSubscription} from '../../../lib/rxstate/testUtils'
import reducer$ from '../reducer'
import {compose$, addMessage$, clear$} from '../actions'
import times from 'lodash/times'

console.log = jest.fn()

describe('chat actions', () => {
  describe('compose$', () => {
    it('adds the message to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = { userId: 'USER_ID', content: 'MESSAGE'}

      compose$.next(message)

      return mockSubscribe(state => {
        expect(state.messages.length).toBe(1)
        expect(state.messages[0].userId).toBe(message.userId)
        expect(state.messages[0].content).toBe(message.content)
      })
    })

    it('adds several messages to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const messages = times(5, () => ({ userId: 'USER_ID', content: 'MESSAGE' }))

      messages.forEach(::compose$.next)

      return mockSubscribe(state => {
        expect(state.messages.length).toBe(5)
      })
    })

    it('does not add the message if it is empty', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = { userId: 'USER_ID', content: ''}

      compose$.next(message)

      return mockSubscribe(state => {
        expect(state).toEqual({ messages: [] })
      })
    })
  })

  describe('addMessage$', () => {
    it('adds the message to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = { userId: 'USER_ID', content: 'MESSAGE', timestamp: 'TIMESTAMP' }

      addMessage$.next(message)

      return mockSubscribe(state => {
        expect(state).toEqual({ messages: [message] })
      })
    })
  })

  describe('clear$', () => {
    it('clears all the messages', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = { userId: 'USER_ID', content: 'MESSAGE'}

      addMessage$.next(message)
      clear$.next()

      return mockSubscribe(state => {
        expect(state).toEqual({ messages: [] })
      })
    })
  })
})
