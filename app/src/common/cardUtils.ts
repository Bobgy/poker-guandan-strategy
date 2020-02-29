import { TCard } from './types'
import { CardRaw } from '../loadCppModule'

export const RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  {
    value: '0',
    label: '10',
    isJoker: false,
  },
  'J',
  'Q',
  'K',
  'A',
  {
    value: 'X',
    label: 'Joker',
    isJoker: true,
  },
].map(data => {
  if (typeof data === 'object') {
    return data
  } else {
    const rank = data
    return {
      label: rank,
      value: rank,
      isJoker: false,
    }
  }
})
interface RankIndex {
  [rank: string]: {
    value: string
    label: string
    isJoker: boolean
  }
}
export const RANK: RankIndex = RANKS.reduce((rankIndex: RankIndex, rank) => {
  rankIndex[rank.value] = rank
  return rankIndex
}, {})
interface SuiteIndex {
  [suit: string]: {
    value: string
    label: string
    color: string
  }
}
export const SUIT: SuiteIndex = {
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
export const SUITS = [SUIT.H, SUIT.S, SUIT.C, SUIT.D]
export const SUITS_JOKER = [SUIT.B, SUIT.R]

const ALL_CARDS_ONE_DECK: TCard[] = RANKS.map(rank =>
  rank.isJoker
    ? SUITS_JOKER.map(suit => ({
      rank: rank.value,
      suit: suit.value,
    }))
    : SUITS.map(suit => ({
      rank: rank.value,
      suit: suit.value,
    })),
).reduce((res, cards) => {
  res.push(...cards)
  return res
}, [])

/**
 * reference: https://stackoverflow.com/a/6274381
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

function cardCompare(a: TCard, b: TCard): number {
  const rankA = RANKS.findIndex(rank => rank.value === a.rank)
  const rankB = RANKS.findIndex(rank => rank.value === b.rank)
  if (rankA === -1 || rankB === -1) {
    throw new Error('rank not found for cards, ' + a + ' ' + b)
  }
  if (rankA !== rankB) {
    return rankA - rankB
  }

  return a.suit < b.suit ? -1 : a.suit === b.suit ? 0 : 1
}

function cardEqual(a: TCard, b: TCard): boolean {
  return cardCompare(a, b) === 0
}

function sortCards(a: TCard[]): TCard[] {
  return a.sort(cardCompare)
}

export function generateRandomHands(): TCard[] {
  return sortCards(
    shuffle([...ALL_CARDS_ONE_DECK, ...ALL_CARDS_ONE_DECK]).slice(0, 27),
  )
}

export function canIAddCard(cards: TCard[], cardToAdd: TCard): boolean {
  return cards.filter(card => cardEqual(card, cardToAdd)).length < 2
}

export function cardsToString(cards: TCard[]) {
  return cards
    .map(card => card.rank + card.suit)
    .join('')
}

export function parseRawCard(cardRaw: CardRaw, wildCard: TCard): TCard {
  if (cardRaw.length !== 2) {
    throw new Error('CardRaw should have a length of 2')
  }

  if (cardRaw === 'WC') {
    return wildCard
  }

  return {
    rank: cardRaw[0],
    suit: cardRaw[1],
  }
}
