import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import {merge} from 'rxjs/operator/merge'
import {map} from 'rxjs/operator/map'
import {filter} from 'rxjs/operator/filter'

import {compose$} from './actions'

const initialState = {
  messages: []
}

const composeReducer$ = compose$
  ::filter(payload => payload.length > 0)
  ::map(payload => state => ({ messages: [ ...state.messages, payload ] }))

export default Observable.of(() => initialState)::merge(
  composeReducer$
)
