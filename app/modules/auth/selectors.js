
export const isSignedIn = ({ auth }) => auth && auth.signedIn

export const selectSignedInUser = ({ auth, users }) =>
  users && auth && auth.userId && users[auth.userId]
