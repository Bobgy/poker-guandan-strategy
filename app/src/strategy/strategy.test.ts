import { A, K, NaturalRankWithoutJokers, parseRawCards } from './models/const'
import { planToText } from './models/Plan'
import { calc, Scorers } from './strategy'

type TestCase = {
  name?: string
  cardsText: string
  mainRank?: NaturalRankWithoutJokers
  only?: boolean
  scorer?: Scorers
} & (
  | {
      bestPlan: string[]
      score?: number
      callback?: undefined
    }
  | {
      bestPlan?: undefined
      score?: undefined
      callback: (result: { plan: string[]; score: number }) => void
    }
)

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
      {
        name: 'BOMB_N_TUPLE',
        cardsText: 'H2D2D2S2',
        bestPlan: ['♥2♦2♦2♠2'],
        score: 0,
      },
      {
        cardsText: 'H2H2S2H2D2D2C2C2',
        bestPlan: ['♥2♥2♠2♥2', '♦2♦2♣2♣2'],
        score: 0,
      },
      {
        cardsText: 'H2D2D2S2H3D3S4',
        bestPlan: ['♥2♦2♦2♠2', '♥3♦3', '♠4'],
        score: 2,
      },
      { name: 'STRAIGHT', cardsText: 'H2H3D4H5H6', bestPlan: ['♥2♥3♦4♥5♥6'] },
      { name: 'TUBE', cardsText: 'H2H2H3H3H4H4', bestPlan: ['♥2♥2♥3♥3♥4♥4'] },
      { cardsText: 'DADAH2H2H3H3', bestPlan: ['♦A♦A♥2♥2♥3♥3'] },
      { cardsText: 'HQHQHKHKDADA', bestPlan: ['♥Q♥Q♥K♥K♦A♦A'] },
      {
        name: 'TUBE cannot go from K to 2',
        cardsText: 'HKHKDADAH2H2',
        bestPlan: ['♦A♦A', '♥2♥2', '♥K♥K'],
      },
      { name: 'PLATE', cardsText: 'D6D6D6S7D7H7', bestPlan: ['♦6♦6♦6♠7♦7♥7'] },
      {
        name: 'STRAIGHT_FLUSH',
        cardsText: 'DAD2D3D4D5',
        bestPlan: ['♦A♦2♦3♦4♦5'],
        score: 0,
      },
      {
        name: 'WILD_CARD',
        mainRank: 2,
        cardsText: 'H2D2S2',
        bestPlan: ['♦2♠2♥2'],
      },
      {
        mainRank: 3,
        cardsText: 'H3H3D2S2S2',
        bestPlan: ['♦2♠2♠2♥3♥3'],
        score: 0,
      },
      {
        mainRank: K,
        cardsText: 'HKD3D4D5S6',
        bestPlan: ['♥K♦3♦4♦5♠6'],
      },
      {
        mainRank: K,
        cardsText: 'HKD3D3D4D5D5',
        bestPlan: ['♦3♦3♦4♥K♦5♦5'],
      },
      {
        mainRank: K,
        cardsText: 'HKD3D3D4D4D4',
        bestPlan: ['♦4♦4♦4♥K', '♦3♦3'],
        score: 1,
      },
      {
        mainRank: 9,
        cardsText: 'H9D10DJDQDK',
        bestPlan: ['♥9♦10♦J♦Q♦K'],
        score: 0,
      },
      {
        name: 'FULL_HOUSE',
        cardsText: 'D2D2D3D3D3',
        bestPlan: ['♦3♦3♦3♦2♦2'],
      },
    ]
    runTestCases(testcases)
  })

  describe('real world cases', () => {
    // reverse cards: for(let i=0;i<a.length;i+=2){b=b+a[i+1]+a[i];}
    runTestCase({
      cardsText: 'DAD3H8H6CKSKD4CJD3C3H9C2H5S9DJC3HKH7CKHAH5C2C4S3RJCAS5',
      mainRank: 3,
      bestPlan: [
        '♥5♥6♥7♥8♥9',
        '♣K♠K♥K♣K',
        '♣2♣2♦3♦3♦4♣4',
        '♦A♥A♣A♥5♠5',
        '♣3♣3♠3♣J♦J',
        '♠9',
        'RJ',
      ],
      score: 5,
    })
    runTestCases([
      {
        cardsText: 'DAD3H8H6CKSKD4CJH3H3H9C2H5S9DJC3HKH7CKHAH5C2C4S3RJCAS5',
        mainRank: 3,
        bestPlan: [
          '♥3♥5♥6♥7♥8',
          '♣K♠K♥K♣K',
          '♣2♣2♦3♣3♦4♣4',
          '♦A♥A♣A♥5♠5',
          '♣J♦J♥3♥9♠9',
          '♠3',
          'RJ',
        ],
        score: 5,
      },
      {
        scorer: 'HEURISTICS',
        cardsText: 'DAD3H8H6CKSKD4CJH3H3H9C2H5S9DJC3HKH7CKHAH5C2C4S3RJCAS5',
        mainRank: 3,
        bestPlan: [
          '♥5♥6♥7♥8♥9',
          '♣2♣2♥3♥3',
          '♣K♠K♥K♣K',
          '♣J♦J',
          '♦A♥A♣A♦4♣4',
          '♦3♣3♠3♥5♠5',
          '♠9',
          'RJ',
        ],
        score: -4.788888888888889,
      },
    ])
    runTestCases([
      {
        cardsText: 'CKD10H4DKD6CJCKS2H8DADJD4C9S7HJS3BJRJD2HQH5S8D9S5S10D2C5',
        mainRank: 6,
        bestPlan: [
          '♦A♠2♠3♥4♥5',
          '♦6♠7♥8♣9♦10',
          '♠8♦9♠10♣J♥Q',
          '♠5♣5',
          '♦J♥J',
          '♣K♦K♣K♦2♦2',
          '♦4',
          'BJ',
          'RJ',
        ],
        score: 9,
      },
      {
        scorer: 'HEURISTICS',
        cardsText: 'CKD10H4DKD6CJCKS2H8DADJD4C9S7HJS3BJRJD2HQH5S8D9S5S10D2C5',
        mainRank: 6,
        bestPlan: [
          '♠2♠3♥4♥5♦6',
          '♠7♥8♣9♦10♣J',
          '♠8♦9♠10♦J♥Q',
          '♠5♣5',
          '♣K♦K♣K♦2♦2',
          '♦A',
          '♦4',
          '♥J',
          'BJ',
          'RJ',
        ],
        score: -0.39999999999999986,
      },
    ])
  })

  describe.only('heuristics scorer unit tests', () => {
    runTestCases([
      {
        scorer: 'HEURISTICS',
        cardsText: 'RJRJ',
        bestPlan: ['RJ', 'RJ'],
        score: -2,
      },
      {
        scorer: 'HEURISTICS',
        mainRank: 2,
        cardsText: 'SJSJHJH2',
        bestPlan: ['♠J♠J♥J♥2'],
        score: -1,
      },
    ])
  })
})

function calcBestPlan({
  cardsText,
  mainRank = A,
  scorer,
}: {
  cardsText: string
  mainRank?: NaturalRankWithoutJokers
  scorer?: Scorers
}): { textPlan: string[]; score: number } {
  const plan = calc({ cards: parseRawCards(cardsText), mainRank, scorer })[0]
  return { textPlan: planToText(plan), score: plan.score }
}

function runTestCase({
  name,
  cardsText,
  mainRank,
  bestPlan,
  score,
  only,
  callback,
  scorer,
}: TestCase) {
  const func = only ? it.only : it
  func(
    `${name ? `${name}: ` : ''}Best plan of ${cardsText} should be ${bestPlan}`,
    () => {
      const { textPlan: actualPlan, score: actualScore } = calcBestPlan({
        cardsText,
        mainRank,
        scorer,
      })
      if (!callback) {
        expect({ plan: actualPlan, score: actualScore }).toEqual({
          plan: bestPlan,
          score: score == null ? bestPlan?.length : score,
        })
      } else {
        callback({ plan: actualPlan, score: actualScore })
      }
    },
  )
}

function runTestCases(cases: TestCase[]) {
  // updateTestCases(cases)
  // return
  cases.forEach((testCase) => runTestCase(testCase))
}

function updateTestCases(cases: TestCase[]) {
  let expectedCases: TestCase[] = []
  cases.forEach(({ name, cardsText, mainRank, score, bestPlan, scorer }) => {
    const { textPlan: actualPlan, score: actualScore } = calcBestPlan({
      cardsText,
      mainRank,
      scorer,
    })
    expectedCases.push({
      name,
      scorer,
      cardsText,
      mainRank,
      bestPlan: actualPlan,
      score: actualScore,
    })
  })
  console.log(JSON.stringify(expectedCases))
}
