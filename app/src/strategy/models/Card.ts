import { RANK } from '../../common/cardUtils'
import { TCard } from '../../common/types'
import {
  BLACK_JOKER,
  CardRaw,
  NATURAL_RANK,
  parseRawCards,
  RED_JOKER,
} from './const'
import { GameContext } from './GameContext'
import { makeRank, Rank } from './Rank'
import { AllSuit, SUIT } from './Suite'

export type Card = {
  rank: Rank
  suit: AllSuit
}

export function parseCardRaw(raw: CardRaw, context: GameContext): Card {
  return {
    rank: makeRank({ natural: raw.rank, context }),
    suit: raw.suit,
  }
}

export function cardToText(card: Card): string {
  return SUIT[card.suit].label + NATURAL_RANK[card.rank.natural].label
}

export function parseTCard(card: TCard): CardRaw {
  if (card.rank === 'X') {
    if (card.suit === 'B') {
      return { rank: BLACK_JOKER, suit: 'B' }
    }
    if (card.suit === 'R') {
      return { rank: RED_JOKER, suit: 'R' }
    }
    throw new Error(`Card has unexpected suit '${card.suit}' for Joker`)
  }
  const rankLabel = RANK[card.rank].label
  const cardString = card.suit + rankLabel
  const parsedCards = parseRawCards(cardString)
  if (parsedCards.length !== 1) {
    throw new Error(
      `Unexpected parsedCards length ${
        parsedCards.length
      }, when parsing ${JSON.stringify(card)}`,
    )
  }
  return parsedCards[0]
}
