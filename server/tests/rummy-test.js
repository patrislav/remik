import chai, {expect} from 'chai'
import chaiImmutable from 'chai-immutable'
import {Map, List, fromJS} from 'immutable'

import {orderGroup} from '../../common/cards'
import * as rummy from '../rummy'
import {randomCards} from './rummy-test-helpers'

chai.use(chaiImmutable)

describe('rummy', () => {
  describe('startGame()', () => {
    // TODO: Add tests!
  })

  describe('stopGame()', () => {
    // TODO: Add tests!
  })

  describe('clearBoard()', () => {
    const state = fromJS(randomCards(12, 4, 2, 10))

    it('clears the board', () => {
      expect(rummy.clearBoard(state))
        .to.have.deep.property(['cards', 'board'])
        .that.is.empty
    })

    it('clears the stock pile', () => {
      expect(rummy.clearBoard(state))
        .to.have.deep.property(['cards', 'stock'])
        .that.is.empty
    })

    it('clears the discard pile', () => {
      expect(rummy.clearBoard(state))
        .to.have.deep.property(['cards', 'discard'])
        .that.is.empty
    })

    it('clears the cards of every player', () => {
      const newState = rummy.clearBoard(state)
      newState.get('players').forEach(player => {
        expect(player).to.have.property('cards')
          .that.is.empty
      })
    })
  })

  describe('meldNew()', () => {
    // TODO: Add tests!
  })

  describe('meldExisting()', () => {
    const seat = 'red'

    describe('when the group is not on board', () => {
      const group = ['7d.0', '8d.0', '9d.0']
      const cards = ['Dd.0']
      const state = fromJS({
        cards: {
          board: [
            ['7d.0', '8d.1', '9d.0'] // Slightly different
          ]
        }
      })

      it('throws an error', () => {
        const fn = () => rummy.meldExisting(state, seat, group, cards)
        expect(fn).to.throw(/no such group/)
      })
    })

    describe('when the resulting group would be invalid', () => {
      const group = ['7d.0', '8d.0', '9d.0']
      const cards = ['Jd.0'] // non-consecutive
      const state = fromJS({
        cards: {
          board: [
            group
          ]
        }
      })

      it('throws an error', () => {
        const fn = () => rummy.meldExisting(state, seat, group, cards)
        expect(fn).to.throw(/invalid/)
      })
    })

    describe('when everything is ok', () => {
      const group = ['7d.0', '8d.0', '9d.0']
      const cards = ['Dd.0', '6d.1']
      const state = fromJS({
        cards: {
          board: [
            group
          ]
        },
        changes: []
      })

      const expectedChange = fromJS({
        type: 'meldExisting',
        playerSeat: seat,
        group, cards
      })

      it('adds the change to changes list', () => {
        expect(rummy.meldExisting(state, seat, group, cards))
          .to.have.property('changes')
          .that.is.an.instanceof(List)
          .with.deep.property([0])
          .that.equals(expectedChange)
      })
    })

  })

  describe('drawCard()', () => {
    // TODO: Add tests!
  })

  describe('finishTurn()', () => {
    // TODO: Add tests!
  })

  describe('applyChanges()', () => {
    // TODO: Add tests for meldNew

    describe('meldExisting', () => {
      const seat = 'red'
      const group = ['7d.0', '8d.0', '9d.0']
      const cards = ['Dd.0', '6d.1']
      const initialState = fromJS({
        cards: {
          board: [group]
        },
        players: {
          [seat]: {
            cards
          }
        },
        changes: []
      })

      let state

      beforeEach(() => {
        state = rummy.meldExisting(initialState, seat, group, cards)
      })

      it('adds the change to changes list', () => {
        expect(state)
          .to.have.property('changes')
          .that.is.an.instanceof(List)
          .with.deep.property([0, 'type'])
          .that.equals('meldExisting')
      })

      it('updates the group on the board', () => {
        const resultGroup = fromJS(orderGroup(group.concat(cards)))
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['cards', 'board'])
          .that.is.an.instanceof(List)
          .with.deep.property([0])
          .that.equals(resultGroup)
      })

      it("removes the cards from player's hand", () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.is.empty
      })
    })

    it('clears the changes list', () => {
      const state = fromJS({
        changes: [{ mock: 'mock' }, { another: 'another' }]
      })

      expect(rummy.rollbackChanges(state))
        .to.have.property('changes')
        .that.is.empty
    })
  })

  describe('rollbackChanges()', () => {
    const state = fromJS({
      changes: [{ mock: 'mock' }, { another: 'another' }]
    })

    it('clears the changes list', () => {
      expect(rummy.rollbackChanges(state))
        .to.have.property('changes')
        .that.is.empty
    })
  })

  describe('findGroupIndex()', () => {
    const board = [
      ['As.0', 'Ah.0', 'Ad.0'],
      ['3c.0', '4c.1', '5c.1'],
      ['7d.1', '7c.0', '7h.1']
    ]
    const state = fromJS({
      cards: {
        board
      }
    })

    it('returns the correct index', () => {
      expect(rummy.findGroupIndex(state, board[1])).to.be.equal(1)
    })

    it('returns -1 when not found', () => {
      const group = ['3c.0', '4c.0', '5c.1'] // just slightly different!
      expect(rummy.findGroupIndex(state, group)).to.be.equal(-1)
    })
  })
})
