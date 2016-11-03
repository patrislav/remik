import React, {PropTypes} from 'react'
import {connect} from '../../lib/rxstate'
import {selectLobbyTables} from '../../modules/lobby/selectors'
import styles from './TableList.css'

import LobbyTable from './LobbyTable'

const propTypes = {
  tables: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  })),
  onJoin: PropTypes.func
}

const defaultProps = {
  tables: [],
  onJoin: () => {}
}

export const TableList = ({ tables, onJoin }) => (
  <section className={styles.section}>
    <ul className={styles.list}>
      {tables.map(table =>
        <li key={table.id} className={styles.item}>
          <LobbyTable table={table} onClick={() => onJoin(table.id)} />
        </li>
      )}
    </ul>
  </section>
)

TableList.propTypes = propTypes
TableList.defaultProps = defaultProps

export default connect(state => ({
  tables: selectLobbyTables(state)
}))(TableList)
