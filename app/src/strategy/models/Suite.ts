export type Suit = 'S' | 'C' | 'D' | 'H'
export type SuitRedJoker = 'R'
export type SuitBlackJoker = 'B'
export type SuitJoker = SuitRedJoker | SuitBlackJoker
export type AllSuit = Suit | SuitRedJoker | SuitBlackJoker
export type SuiteMetadata<S> = {
  value: S
  label: string
  color: string
}
export const SUIT_NORMAL: Record<Suit, SuiteMetadata<Suit>> = {
  H: {
    value: 'H',
    label: '♥',
    color: 'red',
  },
  D: {
    value: 'D',
    label: '♦',
    color: 'red',
  },
  S: {
    value: 'S',
    label: '♠',
    color: 'black',
  },
  C: {
    value: 'C',
    label: '♣',
    color: 'black',
  },
} as const
export const SUIT_JOKER: Record<SuitJoker, SuiteMetadata<SuitJoker>> = {
  B: {
    // black joker
    value: 'B',
    label: '',
    color: 'black',
  },
  R: {
    // red joker
    value: 'R',
    label: '',
    color: 'red',
  },
} as const
export const SUITS_JOKER = [SUIT_JOKER.B, SUIT_JOKER.R]
export const SUIT = {
  ...SUIT_NORMAL,
  ...SUIT_JOKER,
}
export const SUITS = [
  SUIT_NORMAL.H,
  SUIT_NORMAL.S,
  SUIT_NORMAL.C,
  SUIT_NORMAL.D,
]
export const SUIT_VALUES = ['S', 'C', 'D', 'H']
export function parseSuit(
  suit: string,
): [undefined, string] | [Suit, undefined] {
  if (!SUIT_VALUES.includes(suit)) {
    return [
      undefined,
      `Suit should be one of ${SUIT_VALUES}, but found ${suit}.`,
    ]
  }
  return [suit as Suit, undefined]
}

const NEXT_SUIT = {
  S: 'C',
  C: 'D',
  D: 'H',
  H: undefined,
} as const
export const SUIT_START: Suit = 'S'
export function getNextSuit(suit: Suit): Suit | undefined {
  return NEXT_SUIT[suit]
}
