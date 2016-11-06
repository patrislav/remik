import {PUT_USER, REMOVE_USER} from './actions'
import omit from 'lodash/omit'

const initialState = {}

export default function (state = initialState, action) {
  switch(action.type) {
  case PUT_USER:
    return { ...state, [action.user.id]: action.user }

  case REMOVE_USER:
    return omit(state, action.userId)

  default:
    return state
  }
}
