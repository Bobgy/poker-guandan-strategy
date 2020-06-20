import {
  NaturalRank,
  PowerRank,
  RED_JOKER,
  BLACK_JOKER,
  A,
} from './models/const'

export function getUsualPowerRank(rank: NaturalRank): PowerRank {
  switch (rank) {
    case RED_JOKER:
      return 14
    case BLACK_JOKER:
      return 13
    case A:
      return 12
    default:
      return (rank - 2) as PowerRank
  }
}
