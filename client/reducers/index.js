import {combineReducers} from 'redux'
import game from './game'
import chat from './chat'
import lobby from './lobby'

/**
 * Import and combine reducers.
 */
export default combineReducers({
  game, chat, lobby
})
