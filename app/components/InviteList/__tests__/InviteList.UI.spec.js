import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'
import times from 'lodash/times'

import {InviteList} from '../InviteList'

describe('<InviteList />', () => {
  it('renders correct UI without props', () => {
    const wrapper = shallow(<InviteList />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('renders correct UI with passed users', () => {
    const users = times(3, i => ({
      id: i.toString(),
      name: `User #${i}`,
      photoURL: `PHOTO_URL_#${i}`
    }))
    const wrapper = shallow(<InviteList users={users} />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
