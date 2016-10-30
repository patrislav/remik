import { actionCreator } from '../../lib/rxstate'

const action = actionCreator('chat')

export const compose$ = action('compose')
