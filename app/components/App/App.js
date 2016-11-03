import React from 'react'
import Chat from '../Chat'
import InviteList from '../InviteList'
import TableList from '../TableList'

const App = () => (
  <div style={{ display: 'flex' }}>
    <div>
      <div style={{ width: 230, height: 320, border: '1px solid blue' }}>
        <InviteList />
      </div>
      <div style={{ width: 230, height: 320, border: '1px solid red' }}>
        <Chat />
      </div>
    </div>
    <div style={{ width: 500, height: 640, border: '1px solid green' }}>
      <TableList />
    </div>
  </div>
)

export default App
