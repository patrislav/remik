import {
  PUT_USER, putUser,
  REMOVE_USER, removeUser
} from '../actions'

describe('users actions', () => {
  describe('putUser()', () => {
    it('returns the proper action', () => {
      const user = { id: 'ID', name: 'NAME' }
      const action = { type: PUT_USER, user }
      expect(putUser(user)).toEqual(action)
    })
  })

  describe('removeUser()', () => {
    it('returns the proper action', () => {
      const userId = 'ID'
      const action = { type: REMOVE_USER, userId }
      expect(removeUser(userId)).toEqual(action)
    })
  })
})
