import { createStore } from './lib/rxstate'
import { rootReducer$, initialState } from './modules'

const store = createStore(rootReducer$, initialState)

export default store
