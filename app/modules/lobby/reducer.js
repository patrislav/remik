import {PUT_TABLE, REMOVE_TABLE} from './actions'
import omit from 'lodash/omit'

const initialState = {
  tables: {}
}

export default function (state = initialState, action) {
  switch(action.type) {
  case PUT_TABLE:
    return { ...state, tables: { ...state.tables, [action.table.id]: action.table.id } }

  case REMOVE_TABLE:
    return { ...state, tables: omit(state.tables, action.tableId) }

  default:
    return state
  }
}
