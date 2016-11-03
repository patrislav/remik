import { selectLobbyTables } from '../selectors'

describe('chat selectors', () => {
  describe('selectLobbyTables', () => {
    it('returns correct data', () => {
      const table1 = { id: 'table1' }
      const table2 = { id: 'table2' }

      const state = {
        lobby: {
          tables: { table1, table2 }
        }
      }

      const expectedTables = [ table1, table2 ]

      expect(selectLobbyTables(state)).toEqual(expectedTables)
    })
  })
})
