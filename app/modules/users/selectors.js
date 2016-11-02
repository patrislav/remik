
export const selectInvitableUsers = ({ users }) =>
  users && Object.keys(users)
    .filter(id => id !== 'me')
    .map(id => users[id])
