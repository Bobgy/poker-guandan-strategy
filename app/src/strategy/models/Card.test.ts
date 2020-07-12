import { parseCardRaw } from './Card'
import { A, BLACK_JOKER, POWER_RANK_MAX } from './const'
import { GameContext } from './GameContext'

describe('parseCardRaw', () => {
  it('parses AH', () => {
    expect(parseCardRaw({ rank: A, suit: 'H' }, new GameContext(2))).toEqual({
      rank: {
        natural: 1,
        power: 11,
      },
      suit: 'H',
    })
  })

  it('parses BJ', () => {
    expect(
      parseCardRaw({ rank: BLACK_JOKER, suit: 'B' }, new GameContext(2)),
    ).toEqual({
      rank: {
        natural: BLACK_JOKER,
        power: POWER_RANK_MAX - 1,
      },
      suit: 'B',
    })
  })
})
