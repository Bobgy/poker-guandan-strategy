import { CardRaw, NATURAL_RANK } from './const'
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
