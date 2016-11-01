import {createMockSubscription} from '../../../lib/rxstate/testUtils'
import reducer$ from '../reducer'
import {compose$} from '../actions'

console.log = jest.fn()

describe('chat actions', () => {
  describe('compose$', () => {
    it('adds the message to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = 'MESSAGE'

      compose$.next(message)

      return mockSubscribe(state => {
        expect(state).toEqual({ messages: [message] })
      })
    })

    it('does not add the message if it is empty', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'chat')
      const message = ''

      compose$.next(message)

      return mockSubscribe(state => {
        expect(state).toEqual({ messages: [] })
      })
    })
  })
})
