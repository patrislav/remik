import React, {PropTypes} from 'react'
import styles from './LobbyTable.css'

const propTypes = {
  table: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

const LobbyTable = ({ table, ...props }) => (
  <div className={styles.wrapper} {...props}>
    Table #{table.id}
  </div>
)

LobbyTable.propTypes = propTypes

export default LobbyTable
