import React, {Component, PropTypes} from 'react'

import io from '../../socket'

const ENTER_KEY_CODE = 13

export default class MessageComposer extends Component {

  constructor() {
    super()
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <div className='messageComposer'>
        <textarea
          name="chat-message"
          value={this.state.text}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
        />
        <button onClick={this._onSubmit}>Send!</button>
      </div>
    )
  }

  _onChange = (event) => {
    this.setState({
      text: event.target.value
    })
    io.socket.emit('chat.typing')
  }

  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault()
      this._onSubmit()
    }
  }

  _onSubmit = () => {
    let message = this.state.text.trim();
    if (message) {
      io.socket.emit('chat.message', message)
      this.setState({ text: '' });
    }
  }

}
