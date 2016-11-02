import { selectInvitableUsers } from '../selectors'

describe('chat selectors', () => {
  describe('selectInvitableUsers', () => {
    it('returns correct data', () => {
      const user1 = { id: 'user1', firstName: 'John', lastName: 'Smith', name: 'John Smith' }
      const user2 = { id: 'user2', firstName: 'Jane', lastName: 'Alpaca', name: 'Jane Alpaca' }

      const state = {
        users: { user1, user2 }
      }

      const expectedUsers = [ user1, user2 ]

      expect(selectInvitableUsers(state)).toEqual(expectedUsers)
    })

    it('filters out the currently logged in user', () => {
      const user1 = { id: 'user1', firstName: 'John', lastName: 'Smith', name: 'John Smith' }
      const user2 = { id: 'user2', firstName: 'Jane', lastName: 'Alpaca', name: 'Jane Alpaca' }
      const me = { id: 'me', firstName: 'Dummy', lastName: 'User', name: 'Dummy User' }

      const state = {
        users: { user1, me, user2 }
      }

      const expectedUsers = [ user1, user2 ]

      expect(selectInvitableUsers(state)).toEqual(expectedUsers)
    })
  })
})
