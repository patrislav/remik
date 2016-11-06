import {
  PUT_TABLE, putTable,
  REMOVE_TABLE, removeTable
} from '../actions'

describe('lobby actions', () => {
  describe('putTable()', () => {
    it('returns the proper action', () => {
      const table = { id: 'ID' }
      const action = { type: PUT_TABLE, table }
      expect(putTable(table)).toEqual(action)
    })
  })

  describe('removeTable()', () => {
    it('returns the proper action', () => {
      const tableId = 'ID'
      const action = { type: REMOVE_TABLE, tableId }
      expect(removeTable(tableId)).toEqual(action)
    })
  })
})
