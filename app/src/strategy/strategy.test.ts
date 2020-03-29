import './utils'
import { calc } from './strategy'

describe('Strategy Module', () => {
  it("doesn't crash when 0 cards provided", () => {
    expect(calc([])).toBe(null)
  })
})
