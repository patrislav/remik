import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import Button from '../Button'

describe('<Button />', () => {
  it('renders correct UI with default props', () => {
    const wrapper = shallow(<Button />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('renders correct UI with provided label', () => {
    const wrapper = shallow(<Button>LABEL</Button>)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
