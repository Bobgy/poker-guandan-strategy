import { parseCardRaw } from './Card'
import { A, BLACK_JOKER, POWER_RANK_MAX } from './const'
import { GameContext } from './GameContext'

describe('parseCardRaw', () => {
  it('parses AH', () => {
    expect(parseCardRaw({ rank: A, suit: 'H' }, new GameContext(2))).toEqual({
      rank: {
        naturalRank: 1,
        powerRank: 11,
      },
      suit: 'H',
    })
  })

  it('parses BJ', () => {
    expect(
      parseCardRaw({ rank: BLACK_JOKER, suit: 'B' }, new GameContext(2)),
    ).toEqual({
      rank: {
        naturalRank: BLACK_JOKER,
        powerRank: POWER_RANK_MAX - 1,
      },
      suit: 'B',
    })
  })
})
