import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styles from './InviteList.css'
import values from 'lodash/values'

import InvitableUser from './InvitableUser'

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    photoURL: PropTypes.string
  })),
  onInvite: PropTypes.func
}

const defaultProps = {
  users: [],
  onInvite: () => {}
}

const mapStateToProps = state => ({
  users: values(state.users)
})

export const InviteList = ({ users, onInvite }) => (
  <section className={styles.section}>
    <ul className={styles.list}>
      {users.map(user =>
        <li key={user.id} className={styles.item}>
          <InvitableUser user={user} onClick={() => onInvite(user.id)} />
        </li>
      )}
    </ul>
  </section>
)

InviteList.propTypes = propTypes
InviteList.defaultProps = defaultProps

export default connect(mapStateToProps)(InviteList)
