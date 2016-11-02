
export const selectInvitableUsers = (state) =>
  state.users && Object.keys(state.users)
    .filter(id => id !== 'me')
    .map(id => state.users[id])
