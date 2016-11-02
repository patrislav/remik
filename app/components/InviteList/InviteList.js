import React, {PropTypes} from 'react'
import {connect} from '../../lib/rxstate'
import {selectInvitableUsers} from '../../modules/users/selectors'
import styles from './InviteList.css'

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

export default connect(state => ({
  users: selectInvitableUsers(state)
}))(InviteList)
