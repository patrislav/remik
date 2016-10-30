import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import {merge} from 'rxjs/operator/merge'
import {map} from 'rxjs/operator/map'

import {compose$} from './actions'

const initialState = {
  messages: []
}

const composeReducer$ = compose$
  ::map(payload => state => ({ messages: [ ...state.messages, payload ] }))

export default Observable.of(() => initialState)::merge(
  composeReducer$
)
