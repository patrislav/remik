import { actionCreator } from '../../lib/rxstate'

const action = actionCreator('counter')

export const increment$ = action('increment')
export const decrement$ = action('decrement')
export const reset$ = action('reset')
