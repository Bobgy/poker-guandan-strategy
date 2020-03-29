import {
  NaturalRankWithoutJokers,
  NaturalRank,
  PowerRank,
  RED_JOKER,
  BLACK_JOKER,
  getUsualPowerRank,
} from './utils'

export class GameContext {
  constructor(mainRank: NaturalRankWithoutJokers) {
    this.mainRank = mainRank
  }
  /** Which rank is largest in current game play. */
  readonly mainRank: NaturalRankWithoutJokers
  /**
   * Returns range[0, 14], power of the rank in this gameplay.
   * The weakest is 0. The strongest (red joker) is 14.
   */
  getOrder(rank: NaturalRank): PowerRank {
    if (rank == RED_JOKER) {
      return 14
    } else if (rank == BLACK_JOKER) {
      return 13
    } else if (rank == this.mainRank) {
      return 12
    } else {
      const usualRank = getUsualPowerRank(rank)
      const mainRankUsualRank = getUsualPowerRank(this.mainRank)
      if (usualRank > mainRankUsualRank) {
        return (usualRank - 1) as PowerRank
      } else {
        return usualRank as PowerRank
      }
    }
  }
}
