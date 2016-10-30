import React from 'react'
import {mount} from 'enzyme'

import MessageComposer from '../MessageComposer'

describe('<MessageComposer />', () => {
  it('calls onCompose with the correct value on button click', () => {
    const value = 'MESSAGE'
    const onCompose = jest.fn()
    const wrapper = mount(<MessageComposer onCompose={onCompose} />)

    wrapper.find('textarea').simulate('change', { target: { value } })
    wrapper.find('button').simulate('click')

    expect(onCompose).toHaveBeenCalledWith(value)
  })

  it('calls onCompose with the correct value when pressing Enter key', () => {
    const value = 'MESSAGE'
    const onCompose = jest.fn()
    const wrapper = mount(<MessageComposer onCompose={onCompose} />)

    wrapper.find('textarea').simulate('change', { target: { value } })
    wrapper.find('textarea').simulate('keydown', { keyCode: 13 })

    expect(onCompose).toHaveBeenCalledWith(value)
  })
})
