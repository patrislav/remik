
export function getUser(state, userId) {
  return state.room.get('spectators').find(u => u.id === userId)
}

export function getProfilePictureUrl(user) {
  return `http://graph.facebook.com/${user.id}/picture`
}
