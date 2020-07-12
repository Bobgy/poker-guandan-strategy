import { Card, parseCardRaw } from './models/Card'
import {
  CardRaw,
  NaturalRank,
  NaturalRankWithoutJokers,
  NATURAL_RANKS,
} from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { Play, PlayType } from './models/Play'

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
          rank: card.rank.power,
        },
        cards: [card],
      }),
    ),
  }
  collectPlan(plan)
}

type RankToCardMap = Partial<Record<NaturalRank, Card[]>>
function buildRankToCardMap(cards: Card[]): RankToCardMap {
  const map: RankToCardMap = {}
  cards.forEach(card => {
    ;(map[card.rank.natural] = map[card.rank.natural] || []).push(card)
  })
  return map
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
