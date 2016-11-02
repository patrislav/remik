import {createMockSubscription} from '../../../lib/rxstate/testUtils'
import reducer$ from '../reducer'
import {putUser$, removeUser$} from '../actions'

console.log = jest.fn()

describe('users actions', () => {
  describe('putUser$', () => {
    it('adds a user to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'users')
      const user = { id: 'ID', name: 'NAME' }

      putUser$.next(user)

      return mockSubscribe(state => {
        expect(state).toEqual({ [user.id]: user })
      })
    })

    it('updates an existing user', () => {
      const user = { id: 'ID', name: 'NAME' }
      const userChanged = { id: 'ID', name: 'NAME_CHANGED' }
      const initialState = { [user.id]: user }
      const mockSubscribe = createMockSubscription(reducer$, 'users', initialState)

      putUser$.next(userChanged)

      return mockSubscribe(state => {
        expect(state).toEqual({ [userChanged.id]: userChanged })
      })
    })
  })

  describe('removeUser$', () => {
    it('removes a user from the state', () => {
      const user = { id: 'ID', name: 'NAME' }
      const initialState = { [user.id]: user }
      const mockSubscribe = createMockSubscription(reducer$, 'users', initialState)

      removeUser$.next(user.id)

      return mockSubscribe(state => {
        expect(state).toEqual({})
      })
    })
  })
})
