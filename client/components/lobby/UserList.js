import React, {Component, PropTypes} from 'react'

export default class UserList extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  render() {
    let userElements = this.props.users.map(user =>
      <li key={user.id}>
        <span>{user.name}</span>
      </li>
    )

    return (
      <section className="userList">
        <ul>
          {userElements}
        </ul>
      </section>
    )
  }
}
