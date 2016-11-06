export const PUT_USER = 'users/PUT_USER'
export const REMOVE_USER = 'users/REMOVE_USER'

export const putUser = (user) => ({ type: PUT_USER, user })
export const removeUser = (userId) => ({ type: REMOVE_USER, userId })
