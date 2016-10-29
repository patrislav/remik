import {combineReducers} from 'redux'
import game from './game'
import chat from './chat'
import lobby from './lobby'
import room from './room'

/**
 * Import and combine reducers.
 */
export default combineReducers({
  game, chat, lobby, room
})
