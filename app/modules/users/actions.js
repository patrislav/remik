import { actionCreator } from '../../lib/rxstate'

const action = actionCreator('users')

export const putUser$ = action('putUser')
export const removeUser$ = action('removeUser')
