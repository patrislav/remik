import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import {of} from 'rxjs/observable/of'
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
  const state$ = Observable::of(initialState)
    ::merge(reducer$)
    ::scan((state, {scope, reducer}) => ({ ...state, [scope]: reducer(state[scope]) }))
    ::share()

  return {
    state$
  }
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
