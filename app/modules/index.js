import {Observable} from 'rxjs/Observable'
import {merge} from 'rxjs/observable/merge'
import {map} from 'rxjs/operator/map'

import counterReducer$ from './counter/reducer'
import chatReducer$ from './chat/reducer'

const rootReducer$ = Observable::merge(
  counterReducer$::map(reducer => ({ scope: 'counter', reducer })),
  chatReducer$::map(reducer => ({ scope: 'chat', reducer }))
)

export default rootReducer$
