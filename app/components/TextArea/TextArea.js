import React, {PropTypes} from 'react'

class TextArea extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  static defaultProps = {
    onChange: () => {},
    value: ''
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { value, onChange, ...props } = this.props
    return (
      <textarea onChange={::this._handleChange} value={value} {...props} />
    )
  }

  _handleChange(event) {
    this.props.onChange(event.target.value)
  }
}

export default TextArea
