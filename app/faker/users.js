import cuid from 'cuid'
import times from 'lodash/times'
import sample from 'lodash/sample'
import reverse from 'lodash/reverse'
import faker from 'faker'
import {putUser$} from '../modules/users'
import {compose$, addMessage$} from '../modules/chat'
import {delay} from 'rxjs/operator/delay'

const genUser = () => {
  const id = cuid()
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const name = firstName + ' ' + lastName
  const photoURL = faker.image.avatar()

  return { id, name, firstName, lastName, photoURL }
}

const users = times(30, genUser)

export function fakeUsers() {
  users.forEach(::putUser$.next)

  putUser$.next({ ...genUser(), id: 'me' })

  compose$
  ::delay(1000).subscribe(message => {
    addMessage$.next({ userId: sample(users).id, content: reverse(message.content.split('')).join('') })
  })
}
