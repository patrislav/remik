import { createStore } from './lib/rxstate'
import rootReducer$ from './modules'

const initialState = {
  counter: {}
}

const store = createStore(rootReducer$, initialState)

export default store
