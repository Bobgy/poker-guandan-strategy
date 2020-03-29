import { calc } from './strategy'
import { A } from './const'

describe('Strategy Module', () => {
  it("doesn't crash when 0 cards provided", () => {
    expect(calc({ cards: [], mainRank: A })).toBe(null)
  })
})
