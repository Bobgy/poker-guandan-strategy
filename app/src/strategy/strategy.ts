import { CardRaw, NaturalRankWithoutJokers } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { Card, parseCardRaw } from './models/Card'
import { PlayType, Play } from './models/Play'

export function calc({
  cards: rawCards,
  mainRank,
}: {
  cards: CardRaw[]
  mainRank: NaturalRankWithoutJokers
}): Plan[] {
  const context = new GameContext(mainRank)
  const cards = rawCards.map(rawCard => parseCardRaw(rawCard, context))
  const bestPlanCollector = makeBestPlanCollector()
  iteratePlans({ cards, collectPlan: bestPlanCollector.collectPlan })
  const bestPlan = bestPlanCollector.getBestPlan()
  if (bestPlan == null) {
    throw new Error('No plan found')
  }
  return [bestPlan]
}

type PlanCollector = (plan: Plan) => void

function iteratePlans({
  cards,
  collectPlan,
}: {
  cards: Card[]
  collectPlan: PlanCollector
}) {
  const plan: Plan = {
    score: 0,
    plays: cards.map(
      (card): Play => ({
        playRank: {
          type: PlayType.SINGLE,
          rank: card.rank.powerRank,
        },
        cards: [card],
      }),
    ),
  }
  collectPlan(plan)
}

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
