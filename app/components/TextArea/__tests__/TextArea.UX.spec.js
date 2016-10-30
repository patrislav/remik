import React from 'react'
import {shallow} from 'enzyme'

import TextArea from '../TextArea'

describe('<TextArea />', () => {
  it('calls onChange with the changed value', () => {
    const value = 'VALUE'
    const onChange = jest.fn()
    const wrapper = shallow(<TextArea onChange={onChange} />)

    wrapper.simulate('change', { target: { value } })

    expect(onChange).toHaveBeenCalledWith(value)
  })
})
