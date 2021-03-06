import { makeRank } from './Rank'
import { GameContext } from './GameContext'
import { POWER_RANK_MAX, A, RED_JOKER } from './const'

describe('Rank', () => {
  it('is initiated with natural rank and context', () => {
    const context = new GameContext(2)
    const rank = makeRank({ natural: 2, context })
    expect(rank.natural).toBe(2)
    // Only red and black jokers are larger than it.
    expect(rank.power).toBe(POWER_RANK_MAX - 2)
  })

  it('has the same natural rank', () => {
    const context = new GameContext(2)
    const rank2 = makeRank({ natural: 2, context })
    expect(rank2.natural).toBe(2)
    const rankA = makeRank({ natural: A, context })
    expect(rankA.natural).toBe(A)
    const rankRedJoker = makeRank({ natural: RED_JOKER, context })
    expect(rankRedJoker.natural).toBe(RED_JOKER)
  })

  it('has correct power rank', () => {
    const context = new GameContext(2)
    const rank2 = makeRank({ natural: 2, context })
    // Only red and black jokers are larger than main rank 2.
    expect(rank2.power).toBe(POWER_RANK_MAX - 2)
    const rank5 = makeRank({ natural: 5, context })
    // Only 3, 4 are smaller than 5 when main rank is 2.
    expect(rank5.power).toBe(2)
  })
})
