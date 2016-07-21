import React, {Component} from 'react'

import GameAreaView from './GameAreaView'
import HandView from './HandView'

export default class GameView extends Component {
  render() {
    return (
      <section className="gameView">
        <GameAreaView {...this.props} />
        <HandView {...this.props} />
      </section>
    )
  }
}
