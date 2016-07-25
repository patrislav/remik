import {List} from 'immutable'

export function getUser(state, userId) {
  return state.room.get('spectators').find(u => u.id === userId)
}

/**
 * Get the list of typing users
 *
 * @param {Immutable.Map} state The state
 * @returns {Immutable.List} users
 */
export function getTypingUsers(state) {
  return state.chat.get('typingUserTimes')
    .filter((t, userId) => userId !== state.game.get('user').id)
    .filter(time => Date.now() - time < 1500)
    .reduce((list, time, userId) => list.push(getUser(state, userId)), List())
}

export function getProfilePictureUrl(user) {
  return `http://graph.facebook.com/${user.id}/picture`
}
