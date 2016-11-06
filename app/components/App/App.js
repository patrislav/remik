import React, {PropTypes} from 'react'
import LobbyPage from '../../pages/LobbyPage'
import LoadingPage from '../../pages/LoadingPage'

const propTypes = {
  signedIn: PropTypes.bool
}

const defaultProps = {
  signedIn: true
}

export const App = ({ signedIn }) => {
  if (signedIn) {
    return <LobbyPage />
  }

  return <LoadingPage />
}

App.propTypes = propTypes
App.defaultProps = defaultProps

export default App
