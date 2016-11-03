import {createMockSubscription} from '../../../lib/rxstate/testUtils'
import reducer$ from '../reducer'
import {putTable$, removeTable$} from '../actions'

console.log = jest.fn()

describe('lobby actions', () => {
  describe('putTable$', () => {
    it('adds a table to the state', () => {
      const mockSubscribe = createMockSubscription(reducer$, 'lobby')
      const table = { id: 'ID' }

      putTable$.next(table)

      return mockSubscribe(state => {
        expect(state.tables).toEqual({ [table.id]: table })
      })
    })

    it('updates an existing table', () => {
      const table = { id: 'ID' }
      const tableChanged = { id: 'ID' }
      const initialState = { [table.id]: table }
      const mockSubscribe = createMockSubscription(reducer$, 'lobby', initialState)

      putTable$.next(tableChanged)

      return mockSubscribe(state => {
        expect(state.tables).toEqual({ [tableChanged.id]: tableChanged })
      })
    })
  })

  describe('removeTable$', () => {
    it('removes a table from the state', () => {
      const table = { id: 'ID' }
      const initialState = { [table.id]: table }
      const mockSubscribe = createMockSubscription(reducer$, 'lobby', initialState)

      removeTable$.next(table.id)

      return mockSubscribe(state => {
        expect(state.tables).toEqual({})
      })
    })
  })
})
