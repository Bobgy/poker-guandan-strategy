import { Rank, makeRank } from './Rank'
import { AllSuit } from './Suite'
import { CardRaw } from './const'
import { GameContext } from './GameContext'

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
