import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import TextArea from '../TextArea'

describe('<TextArea />', () => {
  it('renders correct UI with default props', () => {
    const wrapper = shallow(<TextArea />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('renders correct UI with provided value', () => {
    const wrapper = shallow(<TextArea value="VALUE" />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
