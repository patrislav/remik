import React from 'react'
import ReactDOM from 'react-dom'

import RootContainer from './containers/RootContainer'

const mountNode = document.getElementById('root')
const render = Container => {
  ReactDOM.render((
    <Container />
  ), mountNode)
}

render(RootContainer)
