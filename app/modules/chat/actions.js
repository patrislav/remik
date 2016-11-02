import { actionCreator } from '../../lib/rxstate'

const action = actionCreator('chat')

export const compose$ = action('compose')
export const addMessage$ = action('addMessage')
export const clear$ = action('clear')
