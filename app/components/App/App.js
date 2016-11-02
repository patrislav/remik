import React from 'react'
import Chat from '../Chat'
import InviteList from '../InviteList'

const App = () => (
  <div>
    <div style={{ width: 230, height: 320, border: '1px solid blue' }}>
      <InviteList />
    </div>
    <div style={{ width: 230, height: 320, border: '1px solid red' }}>
      <Chat />
    </div>
  </div>
)

export default App
