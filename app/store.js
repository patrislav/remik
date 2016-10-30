import { createStore } from './lib/rxstate'
import rootReducer$ from './modules'

const initialState = {
  counter: {},
  chat: {}
}

const store = createStore(rootReducer$, initialState)

export default store
