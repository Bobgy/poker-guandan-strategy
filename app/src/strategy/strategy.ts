import { MAX_PLANS } from './const'
import { iteratePlans } from './iterate'
import { parseCardRaw } from './models/Card'
import { CardRaw, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'

export function calc({
  cards: rawCards,
  mainRank,
  morePlans = true,
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
  morePlans?: boolean // not only return the best plan
}): Plan[] {
  const context = new GameContext(mainRank)
  const cards = rawCards.map((rawCard) => parseCardRaw(rawCard, context))
  if (morePlans) {
    const planCollector = makeAllBestPlansCollector()
    iteratePlans({ cards, collectPlan: planCollector.collectPlan, context })
    const bestPlans = planCollector.getBestPlans()
    if (bestPlans.length == 0) {
      throw new Error('No plan found')
    }
    return bestPlans
  } else {
    const bestPlanCollector = makeBestPlanCollector()
    iteratePlans({ cards, collectPlan: bestPlanCollector.collectPlan, context })
    const bestPlan = bestPlanCollector.getBestPlan()
    if (bestPlan == null) {
      throw new Error('No plan found')
    }
    return [bestPlan]
  }
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

const makeAllBestPlansCollector = () => {
  let bestPlans: Plan[] = []
  let count = 0
  return {
    collectPlan: (plan: Plan) => {
      ++count
      if (count > MAX_PLANS) {
        throw new Error('too many plans')
      }
      if (bestPlans.length === 0) {
        bestPlans.push(plan)
      } else if (plan.score < bestPlans[0].score) {
        bestPlans = [plan]
      } else if (plan.score === bestPlans[0].score) {
        bestPlans.push(plan)
      } else {
        // ignore non-best plans
      }
    },
    getBestPlans: () => bestPlans,
  }
}
