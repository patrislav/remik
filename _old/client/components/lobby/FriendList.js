import React, {Component, PropTypes} from 'react'

export default class FriendList extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired
  }
  
  render() {
    let userElements = this.props.users.map(user =>
      <li key={user.id}>
        <img src={user.picture.data.url} /> <span>{user.name}</span>
      </li>
    )

    return (
      <section className="userList">
        <h4>Invite friends</h4>
        <ul>
          {userElements}
        </ul>
      </section>
    )
  }
}
