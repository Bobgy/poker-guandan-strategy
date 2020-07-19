import { A, NaturalRankWithoutJokers, parseRawCards } from './models/const'
import { planToText } from './models/Plan'
import { calc } from './strategy'

describe('Strategy Module', () => {
  it("doesn't crash when 0 cards provided", () => {
    expect(calcBestPlan({ cardsText: '' })).toEqual([])
  })

  it('plays one card as a SINGLE', () => {
    expect(calcBestPlan({ cardsText: 'H2' })).toEqual(['H2'])
  })

  it('plays two different cards as two SINGLEs', () => {
    expect(calcBestPlan({ cardsText: 'H2H3' })).toEqual(['H2', 'H3'])
  })
})

function calcBestPlan({
  cardsText,
  mainRank = A,
}: {
  cardsText: string
  mainRank?: NaturalRankWithoutJokers
}): string[] {
  return planToText(calc({ cards: parseRawCards(cardsText), mainRank })[0])
}
