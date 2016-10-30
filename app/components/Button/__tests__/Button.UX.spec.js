import React from 'react'
import {shallow} from 'enzyme'

import Button from '../Button'

describe('<Button />', () => {
  it('calls onClick', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<Button onClick={onClick} />)

    wrapper.simulate('click')

    expect(onClick).toHaveBeenCalled()
  })
})
