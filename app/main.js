import React from 'react'
import ReactDOM from 'react-dom'
import {StateProvider} from './lib/rxstate'

import RootContainer from './containers/RootContainer'
import store from './store'

const mountNode = document.getElementById('root')
const render = Container => {
  ReactDOM.render((
    <StateProvider store={store}>
      <Container />
    </StateProvider>
  ), mountNode)
}

render(RootContainer)
