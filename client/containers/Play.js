import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../actions'

import UserList from '../components/UserList'
import Chat from '../components/Chat'
import GameView from '../components/GameView'

@connect( () => { return {} } )
export default class Play extends Component {
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

  render() {
    return (
      <div className='play'>
        <aside>
          <UserList />
          <Chat />
        </aside>
        <main>
          <GameView />
        </main>
      </div>
    )
  }
}
