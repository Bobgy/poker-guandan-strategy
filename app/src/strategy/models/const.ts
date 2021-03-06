import { AllSuit, parseSuit, Suit, SuitBlackJoker, SuitRedJoker } from './Suite'

export type J = 11
export const J = 11
export type Q = 12
export const Q = 12
export type K = 13
export const K = 13
export type A = 1
export const A = 1
export type BlackJoker = 14
export const BLACK_JOKER = 14
export type RedJoker = 15
export const RED_JOKER = 15
export type NaturalRank =
  | A
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | J
  | Q
  | K
  | BlackJoker
  | RedJoker
export const NATURAL_RANK_MIN = A
export const NATURAL_RANK_MAX = RED_JOKER
export type NaturalRankWithoutJokers = Exclude<
  NaturalRank,
  BlackJoker | RedJoker
>
export const NATURAL_RANKS = [
  A,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  J,
  Q,
  K,
  BLACK_JOKER,
  RED_JOKER,
] as const
interface RankMetadata {
  label: string
  text: string
  naturalRank: NaturalRank
}
export const NATURAL_RANK: Record<NaturalRank, RankMetadata> = {
  [A]: { label: 'A', text: 'A', naturalRank: A },
  2: { label: '2', text: '2', naturalRank: 2 },
  3: { label: '3', text: '3', naturalRank: 3 },
  4: { label: '4', text: '4', naturalRank: 4 },
  5: { label: '5', text: '5', naturalRank: 5 },
  6: { label: '6', text: '6', naturalRank: 6 },
  7: { label: '7', text: '7', naturalRank: 7 },
  8: { label: '8', text: '8', naturalRank: 8 },
  9: { label: '9', text: '9', naturalRank: 9 },
  10: { label: '10', text: '10', naturalRank: 10 },
  [J]: { label: 'J', text: 'J', naturalRank: J },
  [Q]: { label: 'Q', text: 'Q', naturalRank: Q },
  [K]: { label: 'K', text: 'K', naturalRank: K },
  [BLACK_JOKER]: { label: 'Joker', text: 'J', naturalRank: BLACK_JOKER },
  [RED_JOKER]: { label: 'Joker', text: 'J', naturalRank: RED_JOKER },
} as const
export function nextRank(rank: NaturalRank): NaturalRank | undefined {
  const next = rank + 1
  if (next > RED_JOKER) {
    return undefined
  }
  return next as NaturalRank
}
export const NATURAL_RANKS_WITHOUT_JOKERS: NaturalRankWithoutJokers[] = NATURAL_RANKS.slice(
  0,
  NATURAL_RANKS.length - 2,
) as any
/**
 * There are 15 different cards. In one game play, they will have a power
 * rank depending on main rank.
 */
export type PowerRank =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
export const POWER_RANK_MAX = 14
export type CardRaw =
  | {
      // Natural rank, from [A, K] maps to [1, 13]
      // 14 is kept for A's order rank.
      // Black Joker is 15, Red Joker is 16
      rank: NaturalRankWithoutJokers
      suit: Suit
    }
  | {
      rank: BlackJoker
      suit: SuitBlackJoker
    }
  | {
      rank: RedJoker
      suit: SuitRedJoker
    }
export type CardRawLoose = { rank: NaturalRank; suit: AllSuit }

export function parseRawCards(text: string): CardRaw[] {
  const cards: CardRaw[] = []
  for (let i = 0; i < text.length; ) {
    if (text[i] === 'R') {
      if (text[i + 1] !== 'J') {
        throw new Error(
          `R should be followed by J -- red joker in ${text}, position ${i}`,
        )
      }
      cards.push({ rank: RED_JOKER, suit: 'R' })
      i += 2
    } else if (text[i] === 'B') {
      if (text[i + 1] !== 'J') {
        throw new Error(
          `B should be followed by J -- black joker in ${text}, position ${i}`,
        )
      }
      cards.push({ rank: BLACK_JOKER, suit: 'B' })
      i += 2
    } else {
      const parsedSuit = parseSuit(text[i])
      const [_, error] = parsedSuit
      if (parsedSuit[1] != null) {
        throw new Error(`${error}, in ${text}, position ${i}`)
      }
      const [suit] = parsedSuit
      if (text[i + 1] === '1' && text[i + 2] === '0') {
        cards.push({ rank: 10, suit })
        i += 3
      } else if (text[i + 1] === 'A') {
        cards.push({ rank: A, suit })
        i += 2
      } else if (text[i + 1] === 'J') {
        cards.push({ rank: J, suit })
        i += 2
      } else if (text[i + 1] === 'Q') {
        cards.push({ rank: Q, suit })
        i += 2
      } else if (text[i + 1] === 'K') {
        cards.push({ rank: K, suit })
        i += 2
      } else {
        const rank = text[i + 1].charCodeAt(0) - '0'.charCodeAt(0)
        if (rank < 2 || rank > 9) {
          throw new Error(
            `Rank should be in range [2, 9], but found ${rank}, in ${text}, position ${
              i + 1
            }`,
          )
        }
        cards.push({ rank: rank as NaturalRankWithoutJokers, suit })
        i += 2
      }
    }
  }
  return cards
}
