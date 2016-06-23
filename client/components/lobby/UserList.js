import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

@connect(state => {
  return {
    users: state.lobby.get('users')
  }
})
export default class UserList extends Component {
  render() {
    let userElements = this.props.users.map(user =>
      <li key={user.id}>
        <span>{user.name}</span>
      </li>
    )

    return (
      <section className='userList'>
        <ul>
          {userElements}
        </ul>
      </section>
    )
  }
}
