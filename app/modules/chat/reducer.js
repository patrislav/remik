import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import {merge} from 'rxjs/operator/merge'
import {map} from 'rxjs/operator/map'
import {mapTo} from 'rxjs/operator/mapTo'
import {filter} from 'rxjs/operator/filter'
import {ignoreElements} from 'rxjs/operator/ignoreElements'

import {compose$, addMessage$, clear$} from './actions'

const initialState = {
  messages: []
}

const addMessageReducer$ = addMessage$
  ::map(payload => state => ({ messages: [ ...state.messages, payload ] }))

const composeReducer$ = compose$
  ::filter(({ content }) => content.length > 0)
  ::map(payload => ({ ...payload, timestamp: new Date() }))
  .do(payload => addMessage$.next(payload))
  ::ignoreElements()

const clearReducer$ = clear$
  ::mapTo(() => ({ messages: [] }))

export default Observable.of(() => initialState)::merge(
  composeReducer$, addMessageReducer$, clearReducer$
)
