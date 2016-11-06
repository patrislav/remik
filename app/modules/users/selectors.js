
export const selectInvitableUsers = ({ users, auth }) =>
  users && Object.keys(users)
    .filter(id => id !== auth.userId)
    .map(id => users[id])
