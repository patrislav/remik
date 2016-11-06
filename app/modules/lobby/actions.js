export const PUT_TABLE = 'lobby/PUT_TABLE'
export const REMOVE_TABLE = 'lobby/REMOVE_TABLE'

export const putTable = table => ({ type: PUT_TABLE, table })
export const removeTable = tableId => ({ type: REMOVE_TABLE, tableId })
