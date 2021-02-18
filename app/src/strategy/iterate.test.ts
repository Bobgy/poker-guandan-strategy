import {
  ITERATOR_STATE_START,
  nextIteratorState,
  playStraight,
  TEST_ONLY,
} from './iterate'
import { parseCardRaw } from './models/Card'
import { A, NaturalRankWithoutJokers, parseRawCards } from './models/const'
import { GameContext } from './models/GameContext'

describe('iterate', () => {
  describe('nextIteratorState', () => {
    it('works', () => {
      let next = nextIteratorState(ITERATOR_STATE_START)
      expect(next).toMatchInlineSnapshot(`
              Object {
                "rank": 2,
                "suit": "S",
                "type": 8,
              }
          `)
      for (let i = 0; i < 100 && next != undefined; ++i) {
        next = nextIteratorState(next!)
      }
      expect(next).toMatchInlineSnapshot(`
        Object {
          "rank": 12,
          "suit": undefined,
          "type": 6,
        }
      `)
      for (let i = 0; i < 100 && next != undefined; ++i) {
        next = nextIteratorState(next!)
      }
      expect(next).toMatchInlineSnapshot(`undefined`)
    })
  })
  describe('playStraight', () => {
    it('returns undefined when cards are not enough', () => {
      const result = playStraight({
        cards: {},
        nowRank: A,
        plan: { plays: [], score: 0 },
        context: { game: new GameContext(A), collectPlan: () => null },
      })
      expect(result).toMatchInlineSnapshot(`undefined`)
    })

    it('returns plan and cards', () => {
      const result = playStraight({
        cards: parseCardsText({ cardsText: 'H2H3H4H5D6' }),
        nowRank: 2,
        plan: { plays: [], score: 0 },
        context: {
          game: new GameContext(A),
          collectPlan: () => null,
        },
      })
      expect(result?.plan).toMatchInlineSnapshot(`
        Object {
          "plays": Array [
            Object {
              "cards": Array [
                Object {
                  "rank": Object {
                    "natural": 2,
                    "power": 0,
                  },
                  "suit": "H",
                },
                Object {
                  "rank": Object {
                    "natural": 3,
                    "power": 1,
                  },
                  "suit": "H",
                },
                Object {
                  "rank": Object {
                    "natural": 4,
                    "power": 2,
                  },
                  "suit": "H",
                },
                Object {
                  "rank": Object {
                    "natural": 5,
                    "power": 3,
                  },
                  "suit": "H",
                },
                Object {
                  "rank": Object {
                    "natural": 6,
                    "power": 4,
                  },
                  "suit": "D",
                },
              ],
              "playRank": Object {
                "rank": 2,
                "type": 5,
              },
            },
          ],
          "score": 1,
        }
      `)
      expect(result?.cardsByRank).toMatchInlineSnapshot(`
        Object {
          "2": Array [],
          "3": Array [],
          "4": Array [],
          "5": Array [],
          "6": Array [],
        }
      `)
    })
  })
})

function parseCardsText({
  cardsText,
  mainRank = A,
}: {
  cardsText: string
  mainRank?: NaturalRankWithoutJokers
}) {
  const context = new GameContext(mainRank)
  return TEST_ONLY.organize(
    parseRawCards(cardsText).map((raw) => parseCardRaw(raw, context)),
  )
}
