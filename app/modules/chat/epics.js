import { combineEpics } from 'redux-observable'
import { map } from 'rxjs/operator/map'
import { COMPOSE_MESSAGE, addMessage } from './actions'

const composeMessageEpic = (action$, { getState }) =>
  action$.ofType(COMPOSE_MESSAGE)
    ::map(({ content }) => addMessage({ userId: getState().auth.userId, content }))

export default combineEpics(
  composeMessageEpic
)
