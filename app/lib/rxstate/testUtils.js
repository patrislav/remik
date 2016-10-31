import {map} from 'rxjs/operator/map'
import {createStore} from '.'

export function createMockSubscription(reducer$, scope, timeout = 50) {
  const initialState = { [scope]: {} }
  const { state$ } = createStore(reducer$::map(reducer => ({ scope, reducer })), initialState)
  let state = {}
  const subscription = state$.subscribe(newState => state = newState[scope])

  return function(callback) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(callback(state))
        }
        catch(e) {
          reject(e)
        }
        finally {
          subscription.unsubscribe()
        }
      }, timeout)
    })
  }
}
