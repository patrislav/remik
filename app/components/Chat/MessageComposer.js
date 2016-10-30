import React, {PropTypes} from 'react'
import Button from '../Button'
import TextArea from '../TextArea'

const ENTER_KEY_CODE = 13

class MessageComposer extends React.Component {
  static propTypes = {
    onCompose: PropTypes.func
  }

  static defaultProps = {
    onCompose: () => {}
  }

  state = {
    value: ''
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <TextArea
          value={value}
          onChange={::this.handleChange}
          onKeyDown={::this.handleKeyDown}
        />
        <Button onClick={::this.handleCompose}>Send</Button>
      </div>
    )
  }

  handleChange(value) {
    this.setState({ value })
  }

  handleCompose() {
    const { onCompose } = this.props
    const { value } = this.state
    this.setState({ value: '' })
    onCompose(value)
  }

  handleKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault()
      this.handleCompose()
    }
  }
}

export default MessageComposer
