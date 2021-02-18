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
      name: 'PAIR',
      cardsText: 'H2D2',
      bestPlan: ['H2D2'],
    },
    {
      cardsText: 'H2D2D3',
      bestPlan: ['H2D2', 'D3'],
    },
    {
      cardsText: 'H2D2D2',
      bestPlan: ['H2D2D2'],
    },
    {
      name: 'TRIPLE',
      cardsText: 'H2D2D2S2',
      bestPlan: ['H2D2D2S2'],
    },
    {
      cardsText: 'H2H2S2H2D2D2C2C2',
      bestPlan: ['H2H2S2H2D2D2C2C2'],
    },
    {
      cardsText: 'H2D2D2S2H3D3S4',
      bestPlan: ['H2D2D2S2', 'H3D3', 'S4'],
    },
    {
      name: 'STRAIGHT',
      cardsText: 'H2H3D4H5H6',
      bestPlan: ['H2H3D4H5H6'],
    },
    {
      name: 'TUBE',
      cardsText: 'H2H2H3H3H4H4',
      bestPlan: ['H2H2H3H3H4H4'],
    },
    {
      cardsText: 'HAHAH2H2H3H3',
      bestPlan: ['HAHAH2H2H3H3'],
    },
    {
      cardsText: 'HQHQHKHKHAHA',
      bestPlan: ['HQHQHKHKHAHA'],
    },
    {
      name: 'TUBE cannot go from K to 2',
      cardsText: 'HKHKHAHAH2H2',
      bestPlan: ['HAHA', 'H2H2', 'HKHK'],
    },
    {
      name: 'PLATE',
      cardsText: 'D6D6D6S7D7H7',
      bestPlan: ['D6D6D6S7D7H7'],
    },
  ]
  testcases.forEach(({ name, cardsText, bestPlan }) => {
    it(`${
      name ? `${name}: ` : ''
    }Best plan of ${cardsText} should be ${bestPlan}`, () => {
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
