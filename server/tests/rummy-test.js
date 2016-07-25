import chai, {expect} from 'chai'
import chaiImmutable from 'chai-immutable'
import {List, fromJS} from 'immutable'

import {orderGroup} from '../../common/cards'
import * as rummy from '../rummy'
import {randomCards} from './rummy-test-helpers'
import {phases} from '../../common/constants'

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

  describe('dealCards()', () => {
    // 4 players, no cards on the table
    const playerNum = 4
    const cardNum = 10
    let state

    beforeEach(() => {
      state = fromJS(randomCards(0, 0, playerNum, 0))
    })

    it('deals a specified number of cards to each player', () => {
      state = rummy.dealCards(state, cardNum)

      state.get('players').forEach(player => {
        expect(player)
          .to.have.property('cards')
          .that.has.sizeOf(cardNum)
      })
    })

    it('puts one card on the discard pile', () => {
      expect(rummy.dealCards(state, cardNum))
        .to.have.deep.property(['cards', 'discard'])
        .that.has.sizeOf(1)
    })

    it('removes the dealt cards from the stock', () => {
      const initialStockSize = state.getIn(['cards', 'stock']).size
      const expectedSize = initialStockSize - playerNum*cardNum - 1

      expect(rummy.dealCards(state, cardNum))
        .to.have.deep.property(['cards', 'stock'])
        .that.has.sizeOf(expectedSize)
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

      it('returns the correct change object', () => {
        expect(rummy.meldExisting(state, seat, group, cards))
          .to.be.equal(expectedChange)
      })
    })

  })

  describe('drawCard()', () => {
    const seat = 'red'
    let state

    beforeEach(() => {
      state = fromJS({
        cards: {
          stock: ['2s.0', '3s.0'],
          discard: ['4s.0', '5s.0']
        },
        players: {
          [seat]: {
            cards: ['6s.0'],
            drewFromDiscard: null
          }
        }
      })
    })

    describe('when the pile is stock', () => {
      it('pops the card from the stock', () => {
        expect(rummy.drawCard(state, seat, 'stock'))
          .to.have.deep.property(['cards', 'stock'])
          .that.has.sizeOf(1)
          .and.not.contains('3s.0')
      })

      it("adds the card to the player's hand", () => {
        expect(rummy.drawCard(state, seat, 'stock'))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.has.sizeOf(2)
          .and.contains('3s.0')
      })

      describe('if the stock becomes empty', () => {
        it('removes all but the top card from the discard pile', () => {
          state = state.updateIn(['cards', 'stock'], stock => stock.pop())
          expect(rummy.drawCard(state, seat, 'stock'))
            .to.have.deep.property(['cards', 'discard'])
            .that.has.sizeOf(1)
            .and.contains('5s.0')
        })

        it('adds the cards from the discard pile to the stock', () => {
          state = state.updateIn(['cards', 'stock'], stock => stock.pop())
          expect(rummy.drawCard(state, seat, 'stock'))
            .to.have.deep.property(['cards', 'stock'])
            .that.has.sizeOf(1)
            .and.contains('4s.0')
        })
      })
    })

    describe('when the pile is discard', () => {
      it('pops the card from the discard pile', () => {
        expect(rummy.drawCard(state, seat, 'discard'))
          .to.have.deep.property(['cards', 'discard'])
          .that.has.sizeOf(1)
          .and.not.contains('5s.0')
      })

      it("adds the card to the player's hand", () => {
        expect(rummy.drawCard(state, seat, 'discard'))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.has.sizeOf(2)
          .and.contains('5s.0')
      })

      it('sets the drewFromDiscard property', () => {
        expect(rummy.drawCard(state, seat, 'discard'))
          .to.have.deep.property(['players', seat, 'drewFromDiscard'])
          .that.is.equal('5s.0')
      })
    })

    describe('when the pile name is invalid', () => {
      it('throws an error', () => {
        expect(() => rummy.drawCard(state, seat, 'invalid'))
          .to.throw(Error)
      })
    })
  })

  describe('takeJoker()', () => {
    const seat = 'red'

    describe('when the group is not on board', () => {
      const group = ['X0.0', '7d.0', '8d.0', '9d.0']
      const state = fromJS({
        cards: {
          board: [
            ['X0.0', '7d.0', '8d.1', '9d.0'] // Slightly different
          ]
        },
        players: {
          [seat]: {
            cards: [],
            jokerTaken: null
          }
        },
      })

      it('throws an error', () => {
        const fn = () => rummy.takeJoker(state, seat, group)
        expect(fn).to.throw(/no such group/)
      })
    })

    describe('when the resulting group would be invalid', () => {
      const group = ['7d.0', 'X0.0', '9d.0'] // joker is needed
      const state = fromJS({
        cards: {
          board: [
            group
          ]
        },
        players: {
          [seat]: {
            cards: [],
            jokerTaken: null
          }
        }
      })

      it('throws an error', () => {
        const fn = () => rummy.takeJoker(state, seat, group)
        expect(fn).to.throw(/invalid/)
      })
    })

    describe('when the jokerTaken property is not cleared out', () => {
      const group = ['X0.0', '7d.0', '8d.0', '9d.0']
      const state = fromJS({
        cards: {
          board: [
            group
          ]
        },
        players: {
          [seat]: {
            cards: ['X1.0'],
            jokerTaken: 'X1.0'
          }
        },
        changes: []
      })

      it('throws an error', () => {
        const fn = () => rummy.takeJoker(state, seat, group)
        expect(fn).to.throw(Error)
      })
    })

    describe('when everything is ok', () => {
      const group = ['X0.0', '7d.0', '8d.0', '9d.0']
      const state = fromJS({
        cards: {
          board: [
            group
          ]
        },
        players: {
          [seat]: {
            cards: [],
            jokerTaken: null
          }
        },
        changes: []
      })

      const expectedChange = fromJS({
        type: 'takeJoker',
        playerSeat: seat,
        group
      })

      it('returns the correct change object', () => {
        expect(rummy.takeJoker(state, seat, group))
          .to.be.equal(expectedChange)
      })
    })
  })

  describe('finishTurn()', () => {
    const discarded = 'As.0'
    const cards = ['2d.1', '3s.0', discarded]
    const seat = 'red', otherSeat = 'blue'
    const userId = '12345'
    const initialState = fromJS({
      status: {
        currentPlayer: seat,
        phase: phases.BASE_TURN,
        winner: null
      },
      cards: {
        board: [],
        discard: []
      },
      players: {
        [seat]: {
          id: userId,
          cards,
          jokerTaken: null
        },
        [otherSeat]: {
          cards: ['7c.0']
        }
      },
      changes: []
    })

    it('puts the discarded card onto the discard pile', () => {
      expect(rummy.finishTurn(initialState, seat, discarded))
        .to.have.deep.property(['cards', 'discard'])
        .that.is.instanceof(List)
        .with.property([0])
        .that.is.equal(discarded)
    })

    it("removes the discarded card from the player's hand", () => {
      expect(rummy.finishTurn(initialState, seat, discarded))
        .to.have.deep.property(['players', seat, 'cards'])
        .that.is.instanceof(List)
        .with.sizeOf(2)
        .that.not.includes(discarded)
    })

    it('changes the phase', () => {
      expect(rummy.finishTurn(initialState, seat, discarded))
        .to.have.deep.property(['status', 'phase'])
        .that.is.equal(phases.CARD_TAKING)
    })

    it('changes the currentPlayer', () => {
      expect(rummy.finishTurn(initialState, seat, discarded))
        .to.have.deep.property(['status', 'currentPlayer'])
        .that.is.equal(otherSeat)
    })

    it('clears out the changes list', () => {
      expect(rummy.finishTurn(initialState, seat, discarded))
        .to.have.property('changes')
        .that.is.an.instanceof(List)
        .which.is.empty
    })

    it("throws an error if the card is not in player's hand", () => {
      const state = initialState.updateIn(['players', seat, 'cards'], cards => cards.pop())
      expect(() => rummy.finishTurn(state, seat, discarded))
        .to.throw(Error)
    })

    it('throws an error if jokerTaken property was not cleared out', () => {
      const state = initialState.setIn(['players', seat, 'jokerTaken'], 'X0.0')
      expect(() => rummy.finishTurn(state, seat, discarded))
        .to.throw(Error)
    })

    describe('when the player has no more cards', () => {
      it('sets the phase to GAME_OVER', () => {
        const state = initialState.setIn(['players', seat, 'cards'], List.of(discarded))
        expect(rummy.finishTurn(state, seat, discarded))
          .to.have.deep.property(['status', 'phase'])
          .that.is.equal(phases.GAME_OVER)
      })

      it('sets gameStarted to false', () => {
        const state = initialState.setIn(['players', seat, 'cards'], List.of(discarded))
        expect(rummy.finishTurn(state, seat, discarded))
          .to.have.deep.property(['status', 'gameStarted'])
          .that.is.false
      })

      it('sets the winner property to the current player ID', () => {
        const state = initialState.setIn(['players', seat, 'cards'], List.of(discarded))
        expect(rummy.finishTurn(state, seat, discarded))
          .to.have.deep.property(['status', 'winner'])
          .that.is.equal(userId)
      })
    })
  })

  describe('applyChanges()', () => {
    describe('meldNew', () => {
      const seat = 'red'
      const cards = ['7d.0', '8d.0', 'X0.0', 'Dd.1']
      const initialState = fromJS({
        cards: {
          board: []
        },
        players: {
          [seat]: {
            cards,
            jokerTaken: 'X0.0'
          }
        },
        changes: []
      })

      let state

      beforeEach(() => {
        state = initialState.update('changes', changes =>
          changes.push(rummy.meldNew(seat, cards))
        )
      })

      it('adds the change to changes list', () => {
        expect(state)
          .to.have.property('changes')
          .that.is.an.instanceof(List)
          .with.deep.property([0, 'type'])
          .that.equals('meldNew')
      })

      it('puts a new group on the board', () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['cards', 'board'])
          .that.is.an.instanceof(List)
          .with.deep.property([0])
          .that.equals(List(cards))
      })

      it("removes the cards from player's hand", () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.is.an.instanceof(List)
          .with.sizeOf(0)
      })

      // Of course only when the cards list includes the value in jokerTaken
      // which is the case here
      it('clears out the jokerTaken property', () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'jokerTaken'])
          .that.is.null
      })
    })

    describe('meldExisting', () => {
      const seat = 'red'
      const group = ['7d.0', '8d.0', '9d.0']
      const cards = ['X0.0', '5d.1']
      const initialState = fromJS({
        cards: {
          board: [group]
        },
        players: {
          [seat]: {
            cards,
            jokerTaken: 'X0.0'
          }
        },
        changes: []
      })

      let state

      beforeEach(() => {
        state = initialState.update('changes', changes =>
          changes.push(rummy.meldExisting(initialState, seat, group, cards))
        )
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

      // Of course only when the cards list includes the value in jokerTaken
      // which is the case here
      it('clears out the jokerTaken property', () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'jokerTaken'])
          .that.is.null
      })
    })

    describe('takeJoker', () => {
      const joker = 'X0.0'
      const seat = 'red'
      const group = [joker, '7d.0', '8d.0', '9d.0']
      const cards = ['Dd.0', '6d.1']
      const initialState = fromJS({
        cards: {
          board: [group]
        },
        players: {
          [seat]: {
            cards,
            jokerTaken: null
          }
        },
        changes: []
      })

      let state

      beforeEach(() => {
        state = initialState.update('changes', changes =>
          changes.push(rummy.takeJoker(initialState, seat, group))
        )
      })

      it('adds the change to changes list', () => {
        expect(state)
          .to.have.property('changes')
          .that.is.an.instanceof(List)
          .with.deep.property([0, 'type'])
          .that.equals('takeJoker')
      })

      it('updates the group on the board', () => {
        const resultGroup = fromJS(['7d.0', '8d.0', '9d.0']) // without the joker
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['cards', 'board'])
          .that.is.an.instanceof(List)
          .with.deep.property([0])
          .that.equals(resultGroup)
      })

      it("adds the joker to player's hand", () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.is.an.instanceof(List)
          .and.includes(joker)
      })

      it('updates the jokerTaken property', () => {
        expect(rummy.applyChanges(state))
          .to.have.deep.property(['players', seat, 'jokerTaken'])
          .that.is.equal(joker)
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

  describe('simplifyChanges()', () => {
    it('merges meldNew and meldExisting if they modify the same group')
    it('merges a meldNew and two meldExisting changes')
    it("doesn't merge changes that don't modify the same group")
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

  describe('undoLastChange()', () => {
    const seat = 'red'

    describe('when the list of changes is not empty', () => {
      const lastChange = fromJS({ type: 'test', payload: 123 })
      const drewFromDiscard = 'As.0'
      const state = fromJS({
        changes: [{ type: 'firstChange', payload: 'data' }, lastChange],
        cards: {
          discard: []
        },
        players: {
          [seat]: { drewFromDiscard }
        }
      })

      it('removes the last change', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.property('changes')
          .with.sizeOf(1)
          .that.not.includes(lastChange)
      })

      it('does not change the discard pile', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['cards', 'discard'])
          .that.is.empty
      })

      it('does not change drewFromDiscard', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['players', seat, 'drewFromDiscard'])
          .that.is.equal(drewFromDiscard)
      })
    })

    describe('when the list of changes is empty', () => {
      const drewFromDiscard = 'As.0'
      let state

      beforeEach(() => {
        state = fromJS({
          status: {
            currentPlayer: seat,
            phase: phases.BASE_TURN
          },
          changes: [],
          cards: {
            discard: []
          },
          players: {
            [seat]: {
              cards: ['2s.0', drewFromDiscard],
              drewFromDiscard
            }
          }
        })
      })

      it('keeps the list of changes empty', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.property('changes')
          .that.is.empty
      })

      it("doesn't throw any error", () => {
        expect(() => rummy.undoLastChange(state, seat))
          .to.not.throw(Error)
      })

      it('clears out drewFromDiscard if done this turn', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['players', seat, 'drewFromDiscard'])
          .that.is.null
      })

      it('puts back the drewFromDiscard card on the pile', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['cards', 'discard'])
          .that.contains(drewFromDiscard)
      })

      it("removes the card from player's hand", () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['players', seat, 'cards'])
          .that.not.contains(drewFromDiscard)
      })

      it('changes the phase back to CARD_TAKING', () => {
        expect(rummy.undoLastChange(state, seat))
          .to.have.deep.property(['status', 'phase'])
          .that.is.equal(phases.CARD_TAKING)
      })

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

    it("doesn't mutate the passed array", () => {
      let group = ['7d.0', 'X0.0', '9d.0']
      rummy.findGroupIndex(state, group)
      expect(group).to.eql(['7d.0', 'X0.0', '9d.0'])
    })
  })
})
