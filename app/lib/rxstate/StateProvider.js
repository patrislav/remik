import React, {PropTypes} from 'react'

export default class StateProvider extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      state$: PropTypes.object.isRequired
    }).isRequired,
    children: PropTypes.node.isRequired,
    onStateChanged: PropTypes.func
  }

  static defaultProps = {
    onStateChanged: () => {}
  }

  static childContextTypes = {
    state$: PropTypes.object.isRequired
  }

  getChildContext() {
    const { state$ } = this.props.store
    return { state$ }
  }

  // componentWillMount() {
  //   const { state$ } = this.props.store
  //   this.subscription = state$.subscribe(this.props.onStateChanged)
  // }
  //
  // componentWillUnmount() {
  //   this.subscription.unsubscribe()
  // }

  render() {
    return this.props.children
  }
}
