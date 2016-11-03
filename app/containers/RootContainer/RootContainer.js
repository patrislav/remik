import React from 'react'
import App from '../../components/App'

class RootContainer extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      require('../../faker/fakeData')()
    }
  }

  render() {
    return (
      <App />
    )
  }
}

export default RootContainer
