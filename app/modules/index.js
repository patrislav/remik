import {combineReducerStreams} from '../lib/rxstate'

import counter from './counter/reducer'
import chat from './chat/reducer'

export const { rootReducer$, initialState } = combineReducerStreams({
  counter, chat
})
