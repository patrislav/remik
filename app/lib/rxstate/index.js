import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/of'
import {Subject} from 'rxjs/Subject'
import {map} from 'rxjs/operator/map'
import {merge} from 'rxjs/operator/merge'
import {scan} from 'rxjs/operator/scan'
import {share} from 'rxjs/operator/share'
import 'rxjs/add/operator/do'

export { default as StateProvider } from './StateProvider'
export { default as connect } from './connect'

export function createAction(name) {
  return (new Subject()).do((...params) => log(name, params))
}

export function actionCreator(reducerName) {
  return (actionName) => createAction(`${reducerName}.${actionName}`)
}

export function createStore(reducer$, initialState = {}) {
  const state$ = Observable.of(initialState)
    ::merge(reducer$)
    ::scan((state, {scope, reducer}) => ({ ...state, [scope]: reducer(state[scope]) }))
    ::share()

  return {
    state$
  }
}

/**
 * Take a dictionary of { scope: reducer$ } pairs and combine them into two
 * objects:
 *  - initialState - an object where each scope of the `dictionary` is a key,
 *                   with a value of an empty object
 *  - rootReducer$ - a combined observable of all reducer streams from values of
 *                   `dictionary`
 *
 * @param {object} dictionary The dictionary of scope: reducer$ pairs
 * @return {object} the object with rootReducer$ and initialState
 */
export function combineReducerStreams(dictionary) {
  // { scope: reducer$ } => { scope: {} }
  const initialState = Object.keys(dictionary).reduce((state, key) => (state[key] = {}, state), {})
  // map each scope to the reducer operating on that scope
  const reducerStreams = Object.keys(dictionary)
    .map(scope => dictionary[scope]::map(reducer => ({ scope, reducer })))
  const rootReducer$ = Observable.merge(...reducerStreams)

  return { rootReducer$, initialState }
}

/* eslint-disable no-console */
function log(name, params) {
  if (params && params[0]) {
    console.log(name, ...params)
  }
  else {
    console.log(name)
  }
}
