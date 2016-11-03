import cuid from 'cuid'
import times from 'lodash/times'
import sample from 'lodash/sample'
import faker from 'faker/locale/en'
import {putUser$} from '../modules/users'
import {putTable$} from '../modules/lobby'
import {addMessage$} from '../modules/chat'

const genUser = () => {
  const id = cuid()
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const name = firstName + ' ' + lastName
  const photoURL = faker.image.avatar()

  return { id, name, firstName, lastName, photoURL }
}

const genTable = () => {
  const id = cuid()

  return { id }
}

module.exports = function () {
  const users = times(30, genUser)
  users.forEach(::putUser$.next)

  const me = { ...genUser(), id: 'me' }
  putUser$.next(me)

  const tables = times(15, genTable)
  tables.forEach(::putTable$.next)

  window.addMessage = () => {
    const content = sample([faker.lorem.sentence(), faker.company.catchPhrase()])
    addMessage$.next({ userId: sample(users).id, content })
  }
}
