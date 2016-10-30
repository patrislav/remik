import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/merge'
import {merge} from 'rxjs/operator/merge'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {delay} from 'rxjs/operator/delay'

import {increment$, decrement$, reset$} from './actions'

const initialState = {
  isProcessing: false,
  count: 0
}

/**
 * @param {function} callback (state, count) => count
 * @returns {Observable} the resulting observable
 */
function changeStateCount(callback) {
  return this::mergeMap(count =>
    Observable.merge(
      Observable.of(state => ({ ...state, isProcessing: true })),
      Observable.of(state => ({ ...state, isProcessing: false, count: callback(state, count) }))::delay(500)
    )
  )
}

const incrementReducer$ = increment$::changeStateCount((state, payload) => state.count + payload)
const decrementReducer$ = decrement$::changeStateCount((state, payload) => state.count - payload)
const resetReducer$ = reset$::changeStateCount(() => initialState.count)

export default Observable.of(() => initialState)::merge(
  incrementReducer$, decrementReducer$, resetReducer$
)
