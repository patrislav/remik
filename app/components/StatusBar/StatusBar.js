import React, {PropTypes} from 'react'
import {connect} from '../../lib/rxstate'
import {selectSignedInUser} from '../../modules/auth/selectors'
import styles from './StatusBar.css'

const propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired
  }).isRequired
}

export const StatusBar = ({ user }) => (
  <header className={styles.statusBar}>
    {/* <img className={styles.photo} src={user.photoURL} /> */}
    {/* <span className={styles.name}>{user.firstName}</span> */}
  </header>
)

StatusBar.propTypes = propTypes

export default connect(state => ({
  user: selectSignedInUser(state)
  // user: state.users[state.auth.userId]
}))(StatusBar)
