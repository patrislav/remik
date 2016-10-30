import React, {PropTypes} from 'react'
import { connect } from '../../lib/rxstate'
import { increment$, decrement$, reset$ } from '../../modules/counter'

const mapStateToProps = state => ({
  counter: state.counter.count,
  isProcessing: state.counter.isProcessing,
  increment: n => increment$.next(n),
  decrement: n => decrement$.next(n),
  reset: () => reset$.next()
})

const propTypes = {
  counter: PropTypes.number,
  isProcessing: PropTypes.bool,
  increment: PropTypes.func,
  decrement: PropTypes.func,
  reset: PropTypes.func,
}

const Counter = ({ counter, isProcessing, increment, decrement, reset }) => (
  <div>
    <h1>{counter}</h1>
    <hr />
    <div><button onClick={() => increment(10)} disabled={isProcessing}>+10</button></div>
    <div><button onClick={() => increment(1)} disabled={isProcessing}>+1</button></div>
    <div><button onClick={reset} disabled={isProcessing}>Reset</button></div>
    <div><button onClick={() => decrement(1)} disabled={isProcessing}>-1</button></div>
    <div><button onClick={() => decrement(10)} disabled={isProcessing}>-10</button></div>
  </div>
)

Counter.propTypes = propTypes

export default connect(mapStateToProps)(Counter)
