import {
  A,
  NATURAL_RANKS_WITHOUT_JOKERS,
  NATURAL_RANKS,
  NATURAL_RANK,
} from './const'

import { GameContext } from './GameContext'

describe('GameContext', () => {
  it('keeps a mainRank', () => {
    const context = new GameContext(A)
    expect(context.mainRank).toEqual(A)
  })
  NATURAL_RANKS_WITHOUT_JOKERS.map(mainRank => {
    describe(`When main rank is ${mainRank}`, () => {
      it('understands card order', () => {
        const context = new GameContext(mainRank)
        const ranks = NATURAL_RANKS.map(rank => ({
          label: NATURAL_RANK[rank].label,
          rank,
          order: context.getOrder(rank),
        }))
        ranks.sort((a, b) => a.order - b.order)
        expect(ranks.map(rank => rank.label).join(' ')).toMatchSnapshot()
        const orderSet = new Set(ranks.map(rank => rank.order))
        // sanity check for order set
        expect(orderSet.size).toEqual(15)
        orderSet.forEach(order => expect(order >= 0 && order < 15))
      })
    })
  })
})
