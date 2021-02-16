import { iteratePlans } from './iterate'
import { Card, parseCardRaw } from './models/Card'
import { CardRaw, NaturalRank, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { PlayType } from './models/Play'

export function calc({
  cards: rawCards,
  mainRank,
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
}): Plan[] {
  const context = new GameContext(mainRank)
  const cards = rawCards.map((rawCard) => parseCardRaw(rawCard, context))
  const bestPlanCollector = makeBestPlanCollector()
  iteratePlans({ cards, collectPlan: bestPlanCollector.collectPlan, context })
  const bestPlan = bestPlanCollector.getBestPlan()
  if (bestPlan == null) {
    throw new Error('No plan found')
  }
  return [bestPlan]
}

type PlanCollector = (plan: Plan) => void

type RankToCardsMap = Partial<Record<NaturalRank, Card[]>>
function buildRankToCardMap(cards: Card[]): RankToCardsMap {
  const map: RankToCardsMap = {}
  cards.forEach((card) => {
    ;(map[card.rank.natural] = map[card.rank.natural] || []).push(card)
  })
  return map
}

const DFS_PLAY_TYPE_ORDER = [PlayType.PAIR, PlayType.SINGLE]
type DfsState = {
  cardsLeftByRank: RankToCardsMap
  playTypeIndex: number
  minimalRank: NaturalRank
}
type DfsContext = {
  collectPlan: PlanCollector
}
function dfs(state: DfsState, context: DfsContext) {}

const makeBestPlanCollector = () => {
  let bestPlan: Plan | undefined = undefined
  return {
    collectPlan: (plan: Plan) => {
      if (bestPlan == null || plan.score <= bestPlan.score) {
        bestPlan = plan
      }
    },
    getBestPlan: () => bestPlan,
  }
}
