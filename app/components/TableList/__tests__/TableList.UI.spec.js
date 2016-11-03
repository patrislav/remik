import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'
import times from 'lodash/times'

import {TableList} from '../TableList'

describe('<TableList />', () => {
  it('renders correct UI without props', () => {
    const wrapper = shallow(<TableList />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('renders correct UI with passed tables', () => {
    const tables = times(3, i => ({
      id: `table_${i}`
    }))
    const wrapper = shallow(<TableList tables={tables} />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
