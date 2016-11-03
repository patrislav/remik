import { actionCreator } from '../../lib/rxstate'

const action = actionCreator('lobby')

export const putTable$ = action('putTable')
export const removeTable$ = action('removeTable')
