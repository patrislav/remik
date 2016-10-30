import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import {Chat} from '../Chat'

describe('<Chat />', () => {
  it('renders correct UI', () => {
    const wrapper = shallow(<Chat />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
