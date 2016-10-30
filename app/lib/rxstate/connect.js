import React, {PropTypes} from 'react'
import {map} from 'rxjs/operator/map'

export default function connect(selector = state => state) {
  return function wrapWithConnect(WrappedComponent) {
    return class Connect extends React.Component {
      static contextTypes = {
        state$: PropTypes.object.isRequired
      }

      componentWillMount() {
        const { state$ } = this.context
        this.subscription = state$::map(selector).subscribe(::this.setState)
      }

      componentWillUnmount() {
        this.subscription.unsubscribe()
      }

      render() {
        return (<WrappedComponent {...this.state} {...this.props} />)
      }
    }
  }
}
