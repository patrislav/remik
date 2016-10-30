import {Observable} from 'rxjs/Observable'
import {merge} from 'rxjs/observable/merge'
import {map} from 'rxjs/operator/map'

import counterReducer$ from './counter/reducer'

const rootReducer$ = Observable::merge(
  counterReducer$::map(reducer => ({ scope: 'counter', reducer }))
)

export default rootReducer$
