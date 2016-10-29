import React, {Component, PropTypes} from 'react'

const ENTER_KEY_CODE = 13

export default class MessageComposer extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  constructor() {
    super()
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <div className="messageComposer">
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

    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  _onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault()
      this._onSubmit()
    }
  }

  _onSubmit = () => {
    let message = this.state.text.trim()
    if (message) {
      this.setState({ text: '' })
      if (this.props.onSubmit) {
        this.props.onSubmit(message)
      }
    }
  }

}
