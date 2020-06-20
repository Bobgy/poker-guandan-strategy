import { GameContext } from './GameContext'
import { NaturalRank, PowerRank } from './const'

export interface Rank {
  naturalRank: NaturalRank
  powerRank: PowerRank
}

export function makeRank({
  natural,
  context,
}: {
  natural: NaturalRank
  context: GameContext
}): Rank {
  return {
    naturalRank: natural,
    powerRank: context.getOrder(natural),
  }
}
