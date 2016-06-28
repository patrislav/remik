import React, {Component, PropTypes} from 'react'

import PlayProfile from '../PlayProfile'
import SitDownButton from '../SitDownButton'
import StandUpButton from '../StandUpButton'
import LeaveRoomButton from './LeaveRoomButton'

export default class UserList extends Component {

  static propTypes = {
    onSitDown: PropTypes.func,
    onStandUp: PropTypes.func,
    onLeave: PropTypes.func,
    players: PropTypes.object,
    currentlySitting: PropTypes.bool
  }

  static defaultProps = {
    onSitDown: () => {},
    onStandUp: () => {},
    onLeave: () => {},
    players: {},
    currentlySitting: false
  }

  render() {
    return (
      <section className="userList">
        {this.standUpButton()}
        <LeaveRoomButton onClick={this.props.onLeave} />
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
        element = <SitDownButton onClick={this.props.onSitDown(i)} />
      }
      elements.push(<li key={i}>{element}</li>)
    }

    return elements
  }

  standUpButton = () => {
    if (this.props.currentlySitting) {
      return <StandUpButton onClick={this.props.onStandUp} />
    }
  }
}
