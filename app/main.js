import React from 'react'
import ReactDOM from 'react-dom'
import {StateProvider} from './lib/rxstate'

import { AppContainer } from 'react-hot-loader'
import RootContainer from './containers/RootContainer'
import store from './store'

const mountNode = document.getElementById('root')
const render = Container => {
  ReactDOM.render((
    <AppContainer>
      <StateProvider store={store}>
        <Container />
      </StateProvider>
    </AppContainer>
  ), mountNode)
}

render(RootContainer)

if (module.hot) {
  module.hot.accept('./containers/RootContainer', () => {
    const NextContainer = require('./containers/RootContainer').default
    render(NextContainer)
  })
}
