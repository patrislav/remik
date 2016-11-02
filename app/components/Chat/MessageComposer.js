import React, {PropTypes} from 'react'
import keycode from 'keycode'
import Button from '../Button'
import TextArea from '../TextArea'
import styles from './MessageComposer.css'

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
      <div className={styles.composer}>
        <TextArea
          value={value}
          onChange={::this.handleChange}
          onKeyDown={::this.handleKeyDown}
          className={styles.input}
        />
        <Button onClick={::this.handleCompose} className={styles.submit}>Send</Button>
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
    if (event.keyCode === keycode('Enter')) {
      event.preventDefault()
      this.handleCompose()
    }
  }
}

export default MessageComposer
