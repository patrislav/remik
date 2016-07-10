import {expect} from 'chai'

import {checkGroupValidity} from '../validators'

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
