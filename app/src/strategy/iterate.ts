import { Card } from './models/Card'
import { A, NaturalRank, nextRank } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { PlayType } from './models/Play'

export type PlanCollector = (plan: Plan) => void

export function iteratePlans({
  cards,
  collectPlan,
  context,
}: {
  cards: Card[]
  collectPlan: PlanCollector
  context: GameContext
}) {
  const cardsByRank = organize(cards)
  iterateImp({
    nowRank: A,
    cardsByRank,
    plan: { score: 0, plays: [] },
    collectPlan,
    context,
  })
  // const plan: Plan = {
  //   score: 0,
  //   plays: cards.map(
  //     (card): Play => ({
  //       playRank: {
  //         type: PlayType.SINGLE,
  //         rank: card.rank.power,
  //       },
  //       cards: [card],
  //     }),
  //   ),
  // }
  // collectPlan(plan)
}

type CardsByRank = { [R in NaturalRank]?: Card[] }
function organize(cards: Card[]): CardsByRank {
  const organized: CardsByRank = {}
  cards.forEach((card) => {
    organized[card.rank.natural] = organized[card.rank.natural] || []
    organized[card.rank.natural]!.push(card)
  })
  return organized
}

function iterateImp({
  cardsByRank,
  plan,
  collectPlan,
  context,
  nowRank,
}: {
  cardsByRank: CardsByRank
  plan: Plan
  collectPlan: PlanCollector
  context: GameContext
  nowRank: NaturalRank
}) {
  const nowCards = cardsByRank[nowRank]
  const next = nextRank(nowRank)
  if (next == null) {
    collectPlan(playRestOfCardsAsSingles(plan, cardsByRank))
  }
  if (next) {
    iterateImp({
      nowRank: next,
      cardsByRank,
      plan,
      collectPlan,
      context,
    })
  }
  if (nowCards && nowCards.length >= 2) {
    iterateImp({
      nowRank,
      cardsByRank: { ...cardsByRank, [nowRank]: nowCards.slice(2) },
      plan: {
        ...plan,
        score: plan.score + 1,
        plays: plan.plays.concat({
          playRank: {
            type: PlayType.PAIR,
            rank: context.getOrder(nowRank),
          },
          cards: nowCards.slice(0, 2),
        }),
      },
      collectPlan,
      context,
    })
  }
}

function playRestOfCardsAsSingles(plan: Plan, cardsByRank: CardsByRank): Plan {
  const resultPlan = { ...plan, plays: [...plan.plays] }
  Object.entries(cardsByRank).forEach(([_, cards]) => {
    if (!cards) {
      return
    }
    resultPlan.score += cards.length
    cards.forEach((card) => {
      resultPlan.plays.push({
        playRank: {
          type: PlayType.SINGLE,
          rank: card.rank.power,
        },
        cards: [card],
      })
    })
  })
  return resultPlan
}
