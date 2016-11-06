import {ADD_MESSAGE, CLEAR_CHAT} from './actions'

const initialState = {
  messages: []
}

export default function (state = initialState, action) {
  switch(action.type) {
  case ADD_MESSAGE:
    return { ...state, messages: [ ...state.messages, action.message ] }

  case CLEAR_CHAT:
    return { ...state, messages: [] }

  default:
    return state
  }
}
