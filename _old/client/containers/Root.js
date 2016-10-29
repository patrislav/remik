import React, {Component} from 'react'
import {Provider} from 'react-redux'

import Game from './Game'
import store from '../store'

/**
 * Default component, that sets and connects the store to its children.
 * Render Development Tools if in DEBUG mode.
 */
export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Game />
      </Provider>
    )
  }
}
