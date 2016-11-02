import React from 'react'
import {shallow} from 'enzyme'
import {shallowToJson} from 'enzyme-to-json'

import InvitableUser from '../InvitableUser'

describe('<InvitableUser />', () => {
  it('renders correct UI', () => {
    const user = {
      id: 'ID',
      name: 'NAME',
      photoURL: 'PHOTO_URL'
    }
    const wrapper = shallow(<InvitableUser user={user} />)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
