import { A, CardRaw, NaturalRankWithoutJokers } from './models/const'
import { planToText } from './models/Plan'
import { calc } from './strategy'

describe('Strategy Module', () => {
  it("doesn't crash when 0 cards provided", () => {
    expect(calcBestPlan({ cards: [] })).toEqual([])
  })

  it('plays one card as a SINGLE', () => {
    expect(calcBestPlan({ cards: [{ rank: 2, suit: 'H' }] })).toEqual(['♥2'])
  })
})

function calcBestPlan({
  cards,
  mainRank = A,
}: {
  cards: CardRaw[]
  mainRank?: NaturalRankWithoutJokers
}): string[] {
  return planToText(calc({ cards, mainRank })[0])
}
