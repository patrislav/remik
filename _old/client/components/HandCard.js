import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'

import '../styles/cards.scss'

const cardSource = {
  beginDrag(props) {
    return {
      id: props.code,
      index: props.index
    }
  }
}

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the left boundary
    const hoverClientX = clientOffset.x - hoverBoundingRect.left

    // Only perform the move when the mouse has crossed half of the items width

    // Dragging left
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return
    }

    // Dragging right
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return
    }

    // Actually move the card
    props.onMove(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}

@DropTarget('HandCard', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('HandCard', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class HandCard extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    deck: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,

    onMove: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }

  static defaultProps = {
    selected: false
  }

  render() {
    const { deck, selected, isDragging, connectDragSource, connectDropTarget } = this.props

    const opacity = isDragging ? 0.5 : 1
    const className = `playing-card playing-card-${this.getCode()} deck-${deck}`
    let wrapperClassName = 'entity hand-card-wrapper'
    if (selected) {
      wrapperClassName += ' selected'
    }

    return connectDropTarget(connectDragSource(
      <li
        className={wrapperClassName}
        style={{ left: `${this.props.x}px`, opacity }}
        onClick={ this._onClick }
        >
        <div className={className} />
      </li>
    ))
  }

  getCode = () => {
    let code = this.props.code.split('.')[0]
    if (code.charAt(0) === 'X') {
      return 'X'
    }
    return code
  }

  _onClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick()
    }
    event.preventDefault()
  }
}
