import { Card, cardToText } from './Card'
import { PowerRank } from './const'

export enum PlayType {
  UNKNOWN,
  SINGLE,
  PAIR,
  TRIPLE,
  FULL_HOUSE, // like 333,22
  STRAIGHT, // like 12345
  TUBE, // like 33,44,55
  PLATE, // like 333,444
  // === The following is a bomb ===
  STRAIGHT_FLUSH, // like 34567 all hearts
  BOMB_N_TUPLE, // like 4444, 55555, 88888888
  FOUR_JOKER,
}

export type PlayRankBombNTuple = {
  type: PlayType.BOMB_N_TUPLE
  rank: PowerRank
  cardCount: number
}

export type PlayRankFourJoker = {
  type: PlayType.FOUR_JOKER
}

export type PlayRankNormal = {
  type: Exclude<PlayType, PlayType.BOMB_N_TUPLE | PlayType.FOUR_JOKER>
  rank: PowerRank
}

export type PlayRank = PlayRankNormal | PlayRankBombNTuple | PlayRankFourJoker

export type Play = {
  playRank: PlayRank
  cards: Card[]
}

export function playToText(play: Play): string {
  return play.cards.map(cardToText).join('')
}
