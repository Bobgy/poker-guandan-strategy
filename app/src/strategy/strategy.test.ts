import { A, NaturalRankWithoutJokers, parseRawCards } from './models/const'
import { planToText } from './models/Plan'
import { calc } from './strategy'

describe('Strategy Module', () => {
  const testcases = [
    {
      name: "doesn't crash when 0 cards provided",
      cardsText: '',
      bestPlan: [],
    },
    {
      name: 'plays one card as a SINGLE',
      cardsText: 'H2',
      bestPlan: ['H2'],
    },
    {
      name: 'plays two different cards as two SINGLEs',
      cardsText: 'H2H3',
      bestPlan: ['H2', 'H3'],
    },
    {
      name: 'plays two cards of the same rank as a PAIR',
      cardsText: 'H2D2',
      bestPlan: ['H2D2'],
    },
    {
      cardsText: 'H2D2D3',
      bestPlan: ['H2D2', 'D3'],
    },
  ]
  testcases.forEach(({ name, cardsText, bestPlan }) => {
    it(name || `Best plan of ${cardsText} should be ${bestPlan}`, () => {
      expect(calcBestPlan({ cardsText })).toEqual(bestPlan)
    })
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
