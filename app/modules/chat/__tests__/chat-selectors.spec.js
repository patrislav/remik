import { selectMessagesWithAuthors } from '../selectors'

describe('chat selectors', () => {
  describe('selectMessagesWithAuthors', () => {
    it('returns correct data', () => {
      const user1 = { id: 'user1', firstName: 'John' }
      const user2 = { id: 'user2', firstName: 'Jane' }
      const message1 = { userId: 'user1', content: 'CONTENT_1', timestamp: 'TIMESTAMP_1' }
      const message2 = { userId: 'user2', content: 'CONTENT_2', timestamp: 'TIMESTAMP_2' }

      const state = {
        users: { user1, user2 },
        chat: {
          messages: [ message1, message2 ]
        }
      }

      const expectedMessages = [
        { ...message1, author: user1.firstName },
        { ...message2, author: user2.firstName }
      ]

      expect(selectMessagesWithAuthors(state)).toEqual(expectedMessages)
    })
  })
})
