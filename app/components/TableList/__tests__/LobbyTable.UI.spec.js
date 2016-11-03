import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import LobbyTable from '../LobbyTable'

describe('<LobbyTable />', () => {
  it('renders correct UI', () => {
    const table = {
      id: 'ID'
    }
    const wrapper = shallow(<LobbyTable table={table} />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
