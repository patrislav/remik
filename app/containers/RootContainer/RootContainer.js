import React from 'react'
import App from '../../components/App'
import {fakeUsers} from '../../faker/users'

class RootContainer extends React.Component {
  componentDidMount() {
    fakeUsers()
  }

  render() {
    return (
      <App />
    )
  }
}

export default RootContainer
