import {combineReducerStreams} from '../lib/rxstate'

import chat from './chat/reducer'
import users from './users/reducer'

export const { rootReducer$, initialState } = combineReducerStreams({
  chat, users
})
