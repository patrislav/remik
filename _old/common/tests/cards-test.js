import {expect} from 'chai'

import {checkGroupValidity, orderGroup, takeableJokerPosition, groupValue} from '../cards'

describe('checkGroupValidity()', () => {
  const validGroups = [
    ['As.0', '2s.0', '3s.0'],
    ['6d.0', '7d.0', '5d.0', '4d.0'],
    ['9s.0', '9d.0', '9c.0'],
    ['Qh.0', 'Kh.0', 'Ah.0'],
    ['9d.0', 'Dd.0', 'Jd.0', 'Qd.0']
  ]

  const validJokerGroups = [
    ['4s.0', 'X1.0', '6s.0'],
    ['9s.0', 'Ds.0', 'X1.0'],
    ['5s.0', 'X1.0', '5d.0'],
    ['Ah.0', 'X1.0', '3h.0', 'X1.1', '5h.0'],
    ['Qd.0', 'X1.0', 'Ad.0']
  ]

  const invalidGroups = [
    // Too few cards
    ['As.0'],
    ['2s.0', '3s.0'],
    // Set with two cards of the same suit
    ['5s.0', '5s.1', '5d.0'],
    ['Ds.0', 'Ds.0', 'Dd.0'],
    // Run with two cards of the same rank
    ['2d.0', '2d.0', '3d.0'],
    // Not a set nor a run
    ['As.0', 'Ac.0', '2s.0'],
    // Run with a gap
    ['2s.0', '4s.0', '5s.0'],
    ['As.0', '3s.0', '4s.0'],
    ['Jd.0', 'Qd.0', 'Ad.0'],
    // No wrapping ace
    ['Kh.0', 'Ah.0', '2h.0']
  ]

  const invalidJokerGroups = [
    // Max 1 joker in 3-card group
    ['X1.0', '5s.0', 'X1.1'],
    // No two jokers next to one another
    ['5s.0', 'X1.0', 'X1.1', '8s.0']
  ]

  validGroups.concat(validJokerGroups).forEach(group => {
    it(`${JSON.stringify(group)} is valid`, () => {
      expect(checkGroupValidity(group).valid).to.be.true
    })
  })

  invalidGroups.concat(invalidJokerGroups).forEach(group => {
    it(`${JSON.stringify(group)} is invalid`, () => {
      expect(checkGroupValidity(group).valid).to.be.false
    })
  })
})

describe('orderGroup()', () => {
  const orderedGroups = [
    // Order even non-consecutive groups
    [ '7s.0 5s.1 2s.0', '2s.0 5s.1 7s.0' ],
    [ 'Kh.0 Dh.0 Ah.0 Qh.0', 'Dh.0 Qh.0 Kh.0 Ah.0' ],
    // Order ace correctly
    [ '3s.0 2s.0 As.0', 'As.0 2s.0 3s.0'],
    [ 'Qc.0 Ac.0 Kc.0', 'Qc.0 Kc.0 Ac.0']
  ]

  const orderedJokerGroups = [
    [ 'X1.0 8s.0 6s.0', '6s.0 X1.0 8s.0' ],
    [ '4h.0 X1.0 5h.0', '4h.0 5h.0 X1.0' ],
    // TODO: Add these tests
    [ 'X0.0 Ad.0 Qd.0', 'Qd.0 X0.0 Ad.0' ],
    [ 'Kd.1 X0.0 Ad.0 Qd.0', 'X0.0 Qd.0 Kd.1 Ad.0' ],
    [ 'X0.0 Kd.1 Qd.0', 'Qd.0 Kd.1 X0.0']
  ]

  orderedGroups.concat(orderedJokerGroups).forEach(example => {
    it(`${example[0]} is ordered correctly`, () => {
      expect(orderGroup(example[0].split(' '))).to.eql(example[1].split(' '))
    })
  })
})

describe('groupValue', () => {
  const values = {
    '6s.0 X1.0 8s.0': 21,
    '4d.0 5d.0 6d.0 7d.0': 22,
    'Dh.0 Jh.0 Qh.0': 30,
    'As.0 Ad.0 Ah.0': 33,
    '3d.0 3s.0 3c.0': 9,
    'Jh.0 Jc.0 Jd.0': 30,
    'Ah.0 X1.0 3h.0 X1.1 5h.0': 15,
    '9d.0 Dd.0 Jd.0 Qd.0': 39
  }

  for (let key in values) {
    it(`${key} gives the correct value (${values[key]})`, () => {
      expect(groupValue(key.split(' '))).to.be.equal(values[key])
    })
  }
})

describe('takeableJokerPosition()', () => {
  const groups = [
    [ '6s.0 X1.0 8s.0', -1 ],
    [ 'X0.0 Qd.0 Kd.1 Ad.0', 0 ],
    [ 'Jd.0 Qd.0 Kd.1 X0.0', 3 ]
  ]

  groups.forEach(example => {
    it(`${example[0]} gives correct joker position`, () => {
      expect(takeableJokerPosition(example[0].split(' '))).to.be.equal(example[1])
    })
  })
})
