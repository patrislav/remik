import React, {Component, PropTypes} from 'react'

import PlayProfile from '../PlayProfile'
import JoinButton from '../JoinButton'

export default class UserList extends Component {

  static propTypes = {
    onSit: PropTypes.func,
    players: PropTypes.object
  }

  static defaultProps = {
    onSit: () => {},
    players: {}
  }

  render() {
    return (
      <section className="userList">
        {this.profileElements(this.props.players)}
      </section>
    )
  }

  profileElements = (users) => {
    let elements = []
    for (let i in users) {
      let element
      if (users[i]) {
        element = <PlayProfile user={users[i]} />
      }
      else {
        element = <JoinButton onClick={this.props.onSit(i)} />
      }
      elements.push(<li key={i}>{element}</li>)
    }

    return elements
  }
}
