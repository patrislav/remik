import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import MessageComposer from '../MessageComposer'

describe('<MessageComposer />', () => {
  it('renders correct UI', () => {
    const wrapper = shallow(<MessageComposer />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
