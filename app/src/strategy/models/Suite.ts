export type SuiteMetadata = {
  value: string
  label: string
  color: string
}
export type Suit = 'H' | 'D' | 'S' | 'C'
export type SuitRedJoker = 'R'
export type SuitBlackJoker = 'B'
export type AllSuit = Suit | SuitRedJoker | SuitBlackJoker
export const SUIT: Record<AllSuit, SuiteMetadata> = {
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
}
export const SUIT_VALUES = ['H', 'S', 'C', 'D']
export const SUITS = [SUIT.H, SUIT.S, SUIT.C, SUIT.D]
export const SUITS_JOKER = [SUIT.B, SUIT.R]
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