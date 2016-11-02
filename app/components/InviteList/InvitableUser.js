import React, {PropTypes} from 'react'
import styles from './InvitableUser.css'

const propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    photoURL: PropTypes.string.isRequired
  }).isRequired
}

const InvitableUser = ({ user, ...props }) => (
  <button className={styles.wrapper} {...props}>
    <img src={user.photoURL} className={styles.photo} />
    <span className={styles.name}>{user.name}</span>
  </button>
)

InvitableUser.propTypes = propTypes

export default InvitableUser
