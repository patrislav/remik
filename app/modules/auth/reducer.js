import {SIGN_IN} from './actions'

const initialState = {
  signedIn: false,
  userId: null
}

export default function (state = initialState, action) {
  switch(action.type) {
  case SIGN_IN:
    return { ...state, userId: action.userId, signedIn: true }

  default:
    return state
  }
}
