import React from 'react'
// import StatusBar from '../../components/StatusBar'
import InviteList from '../../components/InviteList'
import TableList from '../../components/TableList'
import Chat from '../../components/Chat'

const LobbyPage = () => (
  <div>
    <div style={{ width: 730 }}>
      {/* <StatusBar /> */}
    </div>
    <div style={{ display: 'flex', height: 640 }}>
      <div style={{ width: 230 }}>
        <div style={{ height: 320, border: '1px solid blue' }}>
          <InviteList />
        </div>
        <div style={{ height: 320, border: '1px solid red' }}>
          <Chat />
        </div>
      </div>
      <div style={{ width: 500, border: '1px solid green' }}>
        <TableList />
      </div>
    </div>
  </div>
)

export default LobbyPage
