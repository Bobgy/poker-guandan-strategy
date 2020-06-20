import { calc } from './strategy'
import { A } from './models/const'

describe('Strategy Module', () => {
  it("doesn't crash when 0 cards provided", () => {
    expect(calc({ cards: [], mainRank: A })).toBe(null)
  })
})
