import { MAX_PLANS } from './const'
import { iteratePlans } from './iterate'
import { parseCardRaw } from './models/Card'
import { CardRaw, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'

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

const makeBestPlanCollector = () => {
  let bestPlan: Plan | undefined = undefined
  let count = 0
  return {
    collectPlan: (plan: Plan) => {
      if (bestPlan == null || plan.score <= bestPlan.score) {
        bestPlan = plan
      }
      ++count
      if (count > MAX_PLANS) {
        throw new Error('too many plans')
      }
    },
    getBestPlan: () => bestPlan,
  }
}
