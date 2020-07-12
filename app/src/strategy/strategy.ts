import { CardRaw, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'

export function calc({
  cards,
  mainRank,
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
}): Plan[] {
  const context = new GameContext(mainRank)
  return [{ score: 0, plays: [] }]
}

// function iterateSolutions()
