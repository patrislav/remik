import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

/*
 * Compose a new store from the passed reducers and apply thunk middleware
 */
const store = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducers)

export default store
