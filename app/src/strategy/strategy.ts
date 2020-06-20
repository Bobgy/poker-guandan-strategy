import { CardRaw, NaturalRank, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'

export function calc({
  cards,
  mainRank,
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
}) {
  const context = new GameContext(mainRank)
  return null
}
