import { A, NaturalRankWithoutJokers, parseRawCards } from './models/const'
import { planToText } from './models/Plan'
import { calc } from './strategy'

type TestCase = {
  name?: string
  cardsText: string
  mainRank?: NaturalRankWithoutJokers
  bestPlan: string[]
}

describe('Strategy Module', () => {
  describe('unit tests', () => {
    const testcases: TestCase[] = [
      {
        name: "doesn't crash when 0 cards provided",
        cardsText: '',
        bestPlan: [],
      },
      { name: 'plays one card as a SINGLE', cardsText: 'H2', bestPlan: ['♥2'] },
      {
        name: 'plays two different cards as two SINGLEs',
        cardsText: 'H2H3',
        bestPlan: ['♥2', '♥3'],
      },
      { name: 'PAIR', cardsText: 'H2D2', bestPlan: ['♥2♦2'] },
      { cardsText: 'H2D2D3', bestPlan: ['♥2♦2', '♦3'] },
      { cardsText: 'H2D2D2', bestPlan: ['♥2♦2♦2'] },
      { name: 'TRIPLE', cardsText: 'H2D2D2S2', bestPlan: ['♥2♦2♦2♠2'] },
      { cardsText: 'H2H2S2H2D2D2C2C2', bestPlan: ['♥2♥2♠2♥2♦2♦2♣2♣2'] },
      { cardsText: 'H2D2D2S2H3D3S4', bestPlan: ['♥2♦2♦2♠2', '♥3♦3', '♠4'] },
      { name: 'STRAIGHT', cardsText: 'H2H3D4H5H6', bestPlan: ['♥2♥3♦4♥5♥6'] },
      { name: 'TUBE', cardsText: 'H2H2H3H3H4H4', bestPlan: ['♥2♥2♥3♥3♥4♥4'] },
      { cardsText: 'HAHAH2H2H3H3', bestPlan: ['♥A♥A♥2♥2♥3♥3'] },
      { cardsText: 'HQHQHKHKHAHA', bestPlan: ['♥Q♥Q♥K♥K♥A♥A'] },
      {
        name: 'TUBE cannot go from K to 2',
        cardsText: 'HKHKHAHAH2H2',
        bestPlan: ['♥A♥A', '♥2♥2', '♥K♥K'],
      },
      { name: 'PLATE', cardsText: 'D6D6D6S7D7H7', bestPlan: ['♦6♦6♦6♠7♦7♥7'] },
    ]
    runTestCases(testcases)
  })

  describe('real world cases', () => {
    // reverse cards: for(let i=0;i<a.length;i+=2){b=b+a[i+1]+a[i];}
    const testcases: TestCase[] = [
      {
        cardsText: 'DAD3H8H6CKSKD4CJH3C3H9C2H5S9DJC3HKC7CKHAH5C2C4S3RJCAS5',
        mainRank: 3,
        bestPlan: [
          '♦A♥A♣2♣2♦3♥3',
          '♣3♣3♦4♣4♥5♥5',
          '♠5♥6♣7♥8♥9',
          '♣K♠K♥K♣K',
          '♣J♦J',
          '♣A',
          '♠3',
          '♠9',
          'RJ',
        ],
      },
      {
        cardsText: 'CKD10H4DKD6CJCKS2H8DADJD4C9S7HJS3BJRJD2HQH5S8D9S5S10D2C5',
        mainRank: 6,
        bestPlan: [
          '♦A♠2♠3♥4♥5',
          '♦6♠7♥8♣9♦10',
          '♠8♦9♠10♣J♥Q',
          '♣K♦K♣K',
          '♦2♦2',
          '♠5♣5',
          '♦J♥J',
          '♦4',
          'BJ',
          'RJ',
        ],
      },
    ]
    runTestCases(testcases)
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

function runTestCases(cases: TestCase[]) {
  // updateTestCases(cases)
  // return
  cases.forEach(({ name, cardsText, mainRank, bestPlan }) => {
    it(`${
      name ? `${name}: ` : ''
    }Best plan of ${cardsText} should be ${bestPlan}`, () => {
      expect(calcBestPlan({ cardsText, mainRank })).toEqual(bestPlan)
    })
  })
}

function updateTestCases(cases: TestCase[]) {
  let expectedCases: TestCase[] = []
  cases.forEach(({ name, cardsText, mainRank, bestPlan }) => {
    const actualPlan = calcBestPlan({ cardsText, mainRank })
    expectedCases.push({ name, cardsText, mainRank, bestPlan: actualPlan })
  })
  console.log(JSON.stringify(expectedCases))
}
