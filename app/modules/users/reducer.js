import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import {merge} from 'rxjs/operator/merge'
import {map} from 'rxjs/operator/map'
import omit from 'lodash/omit'

import {putUser$, removeUser$} from './actions'

const initialState = {}

const putUserReducer$ = putUser$
  ::map(user => state => ({ ...state, [user.id]: user }))

const removeUserReducer$ = removeUser$
  ::map(userId => state => omit(state, userId))

export default Observable.of(() => initialState)::merge(
  putUserReducer$, removeUserReducer$
)
