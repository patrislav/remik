import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import MessageList from '../MessageList'

describe('<MessageList />', () => {
  it('renders correct UI with default props', () => {
    const wrapper = shallow(<MessageList />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('renders correct UI when passed a list of messages', () => {
    const messages = [
      'First message',
      'Second message',
      'Third message'
    ]

    const wrapper = shallow(<MessageList messages={messages} />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
