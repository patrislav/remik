import {combineReducerStreams} from '../lib/rxstate'

import chat from './chat/reducer'
import users from './users/reducer'
import lobby from './lobby/reducer'

export const { rootReducer$, initialState } = combineReducerStreams({
  chat, users, lobby
})
