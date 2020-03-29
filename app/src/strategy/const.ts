import { Suit, SuitRedJoker, SuitBlackJoker } from '../common/cardUtils'

export type J = 11
export const J = 11
export type Q = 12
export const Q = 12
export type K = 13
export const K = 13
export type A = 1
export const A = 1
export type BlackJoker = 15
export const BLACK_JOKER = 15
export type RedJoker = 16
export const RED_JOKER = 16
export type NaturalRank =
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
  | J
  | Q
  | K
  | BlackJoker
  | RedJoker
const NATURAL_RANK_MAX = RED_JOKER
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
  naturalRank: NaturalRank
}
export const NATURAL_RANK: Record<NaturalRank, RankMetadata> = {
  [A]: { label: 'A', naturalRank: A },
  2: { label: '2', naturalRank: 2 },
  3: { label: '3', naturalRank: 3 },
  4: { label: '4', naturalRank: 4 },
  5: { label: '5', naturalRank: 5 },
  6: { label: '6', naturalRank: 6 },
  7: { label: '7', naturalRank: 7 },
  8: { label: '8', naturalRank: 8 },
  9: { label: '9', naturalRank: 9 },
  10: { label: '10', naturalRank: 10 },
  [J]: { label: 'J', naturalRank: J },
  [Q]: { label: 'Q', naturalRank: Q },
  [K]: { label: 'K', naturalRank: K },
  [BLACK_JOKER]: { label: 'BJ', naturalRank: BLACK_JOKER },
  [RED_JOKER]: { label: 'RJ', naturalRank: RED_JOKER },
} as const
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
export type Card =
  | {
      // Natural rank, from [A, K] maps to [1, 13]
      // 14 is kept for A's order rank.
      // Black Joker is 15, Red Joker is 16
      rank: NaturalRankWithoutJokers
      suite: Suit
    }
  | {
      rank: BlackJoker
      suite: SuitBlackJoker
    }
  | {
      rank: RedJoker
      suite: SuitRedJoker
    }
