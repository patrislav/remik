import React, {Component, PropTypes} from 'react'
import {getProfilePictureUrl} from '../../helpers'

export default class FriendList extends Component {
  render() {
    let userElements = this.props.users.map(user =>
      <li key={user.id}>
        <img src={user.picture.data.url} /> <span>{user.name}</span>
      </li>
    )

    return (
      <section className='userList'>
        <h4>Invite friends</h4>
        <ul>
          {userElements}
        </ul>
      </section>
    )
  }
}
