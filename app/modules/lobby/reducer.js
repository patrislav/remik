import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import {merge} from 'rxjs/operator/merge'
import {map} from 'rxjs/operator/map'
import omit from 'lodash/omit'

import {putTable$, removeTable$} from './actions'

const initialState = {
  tables: {}
}

const putTableReducer$ = putTable$
  ::map(table => state => ({ ...state, tables: { ...state.tables, [table.id]: table } }))

const removeTableReducer$ = removeTable$
  ::map(tableId => state => ({ ...state, tables: omit(state.tables, tableId) }))

export default Observable.of(() => initialState)::merge(
  putTableReducer$, removeTableReducer$
)
