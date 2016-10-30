import React, {PropTypes} from 'react'

const propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node
}

const defaultProps = {
  onClick: () => {},
  children: ''
}

const Button = ({ onClick, children, ...props }) => (
  <button onClick={onClick} {...props}>{children}</button>
)

Button.propTypes = propTypes
Button.defaultProps = defaultProps

export default Button
