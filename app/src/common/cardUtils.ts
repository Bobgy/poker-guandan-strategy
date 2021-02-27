import {
  BLACK_JOKER,
  CardRaw,
  NATURAL_RANKS,
  RED_JOKER,
} from '../strategy/models/const'
import { SUITS } from '../strategy/models/Suite'

const ALL_CARDS_ONE_DECK: CardRaw[] = NATURAL_RANKS.map((rank): CardRaw[] =>
  rank === BLACK_JOKER
    ? [{ rank, suit: 'B' }]
    : rank === RED_JOKER
    ? [{ rank, suit: 'R' }]
    : SUITS.map((suit) => ({
        rank,
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

function cardCompare(a: CardRaw, b: CardRaw): number {
  if (a.rank !== b.rank) {
    return a.rank - b.rank
  }

  return a.suit < b.suit ? -1 : a.suit === b.suit ? 0 : 1
}

function cardEqual(a: CardRaw, b: CardRaw): boolean {
  return cardCompare(a, b) === 0
}

function sortCards(a: CardRaw[]): CardRaw[] {
  return a.sort(cardCompare)
}

export function generateRandomHands(): CardRaw[] {
  return sortCards(
    shuffle([...ALL_CARDS_ONE_DECK, ...ALL_CARDS_ONE_DECK]).slice(0, 27),
  )
}

export function canIAddCard(cards: CardRaw[], cardToAdd: CardRaw): boolean {
  return cards.filter((card) => cardEqual(card, cardToAdd)).length < 2
}
