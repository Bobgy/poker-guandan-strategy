import { GameContext } from './GameContext'
import { NaturalRank, PowerRank } from './const'

export interface Rank {
  natural: NaturalRank
  power: PowerRank
}

export function makeRank({
  natural,
  context,
}: {
  natural: NaturalRank
  context: GameContext
}): Rank {
  return {
    natural: natural,
    power: context.getOrder(natural),
  }
}
