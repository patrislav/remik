import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../actions'
import Preload from './Preload'
import Lobby from './Lobby'
import Play from './Play'

@connect(state => {
  return {
    screen: state.game.get('screen')
  }
})
export default class Game extends Component {
  /**
   * On class initialization bind all the actions to the dispatch function.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props)
    this.actions = bindActionCreators(Actions, this.props.dispatch)
  }

  /**
   * Expected properties object types.
   */
  static propTypes = {
    screen: PropTypes.string
  }

  /**
   * Expected context object types.
   */
  static childContextTypes = {
    actions: PropTypes.object
  }

  /**
   * Getter for the child context object.
   */
  getChildContext() {
    return {
      actions: this.actions
    }
  }

  /**
   * Render the provided structure.
   */
  render() {
    switch(this.props.screen) {
      case 'lobby':
        return <Lobby />

      case 'play':
        return <Play />

      default:
        return <Preload />
    }
  }
}
