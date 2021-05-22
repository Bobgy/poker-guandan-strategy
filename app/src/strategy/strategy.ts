import { MAX_PLANS } from './const'
import { iteratePlans } from './iterate'
import { parseCardRaw } from './models/Card'
import { CardRaw, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { handsScore, heuristicScore, MAX_SCORE, Scorer } from './scorers'

export type Scorers = 'HANDS' | 'HEURISTICS'

export function calc({
  cards: rawCards,
  mainRank,
  morePlans = true,
  scorer = 'HANDS',
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
  morePlans?: boolean // not only return the best plan
  scorer?: Scorers
}): Plan[] {
  const context = new GameContext(mainRank)
  const cards = rawCards.map((rawCard) => parseCardRaw(rawCard, context))
  const scorerFunc = scorer === 'HEURISTICS' ? heuristicScore : handsScore
  if (morePlans) {
    const planCollector = makeAllBestPlansCollector({ scorer: scorerFunc })
    iteratePlans({ cards, collectPlan: planCollector.collectPlan, context })
    const bestPlans = planCollector.getBestPlans()
    if (bestPlans.length == 0) {
      throw new Error('No plan found')
    }
    return bestPlans
  } else {
    const bestPlanCollector = makeBestPlanCollector({ scorer: scorerFunc })
    iteratePlans({ cards, collectPlan: bestPlanCollector.collectPlan, context })
    const bestPlan = bestPlanCollector.getBestPlan()
    if (bestPlan == null) {
      throw new Error('No plan found')
    }
    return [bestPlan]
  }
}

const makeBestPlanCollector = ({
  scorer = handsScore,
}: { scorer?: Scorer } = {}) => {
  let bestPlan: Plan | undefined = undefined
  let bestScore: number = MAX_SCORE
  let count = 0
  return {
    collectPlan: (plan: Plan) => {
      const currentScore = scorer(plan)
      plan.score = currentScore
      if (bestPlan == null || currentScore <= bestScore) {
        bestPlan = plan
        bestScore = currentScore
      }
      ++count
      if (count > MAX_PLANS) {
        throw new Error('too many plans')
      }
    },
    getBestPlan: () => bestPlan,
  }
}

const makeAllBestPlansCollector = ({
  scorer = handsScore,
}: { scorer?: Scorer } = {}) => {
  let bestPlans: Plan[] = []
  let bestScore: number = MAX_SCORE
  let count = 0
  return {
    collectPlan: (plan: Plan) => {
      ++count
      if (count > MAX_PLANS) {
        throw new Error('too many plans')
      }
      const currentScore = scorer(plan)
      plan.score = currentScore
      if (bestPlans.length === 0) {
        bestPlans.push(plan)
        bestScore = currentScore
      } else if (currentScore < bestScore) {
        bestPlans = [plan]
        bestScore = currentScore
      } else if (currentScore === bestScore) {
        bestPlans.push(plan)
      } else {
        // ignore non-best plans
      }
    },
    getBestPlans: () => bestPlans,
  }
}
