import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import auth from './auth'
import chat, {chatEpic} from './chat'
import lobby from './lobby'
import users from './users'

export const rootReducer = combineReducers({
  auth, chat, lobby, users
})

export const rootEpic = combineEpics(
  chatEpic
)
