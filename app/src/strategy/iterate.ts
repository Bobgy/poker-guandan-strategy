import { Card } from './models/Card'
import { A, NaturalRank, nextRank } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { PlayType } from './models/Play'

const NEXT_PLAY_TYPE: { [T in PlayType]?: PlayType } = {
  [PlayType.PAIR]: PlayType.TRIPLE,
  [PlayType.TRIPLE]: PlayType.BOMB_N_TUPLE,
  [PlayType.BOMB_N_TUPLE]: undefined,
} as const
const PLAY_TYPE_START = PlayType.PAIR
function nextPlayType(playType: PlayType): PlayType | undefined {
  return NEXT_PLAY_TYPE[playType]
}

export type PlanCollector = (plan: Plan) => void

export function iteratePlans({
  cards,
  collectPlan,
  context: gameContext,
}: {
  cards: Card[]
  collectPlan: PlanCollector
  context: GameContext
}) {
  const cardsByRank = organize(cards)
  iterateImp({
    cardsByRank,
    context: {
      collectPlan,
      game: gameContext,
      // debug: true,
    },
  })
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

type IteratorContext = {
  game: GameContext
  collectPlan: PlanCollector
  debug?: boolean
}

type PlayTypeFunc = (args: {
  cards: CardsByRank
  nowRank: NaturalRank
  plan: Plan
  context: IteratorContext
}) => { cardsByRank: CardsByRank; plan: Plan } | undefined
const playCardsOfTheSameRank = (n: number): PlayTypeFunc => ({
  cards,
  nowRank,
  plan,
  context,
}) => {
  const nowCards = cards[nowRank]
  if (!nowCards || nowCards.length < n) {
    return undefined
  }
  return {
    cardsByRank: { ...cards, [nowRank]: nowCards.slice(n) },
    plan: {
      score: plan.score + 1,
      plays: plan.plays.concat({
        playRank: {
          type:
            n === 2
              ? PlayType.PAIR
              : n === 3
              ? PlayType.TRIPLE
              : PlayType.BOMB_N_TUPLE,
          rank: context.game.getOrder(nowRank),
          cardCount: n,
        },
        cards: nowCards.slice(0, n),
      }),
    },
  }
}
const playPair = playCardsOfTheSameRank(2)
const playTriple = playCardsOfTheSameRank(3)
const playBomb4 = playCardsOfTheSameRank(4)
const playBomb5 = playCardsOfTheSameRank(5)
const playBomb6 = playCardsOfTheSameRank(6)
const playBomb7 = playCardsOfTheSameRank(7)
const playBomb8 = playCardsOfTheSameRank(8)
const PLAY_TYPE_FUNC: { [T in PlayType]?: readonly PlayTypeFunc[] } = {
  [PlayType.PAIR]: [playPair],
  [PlayType.TRIPLE]: [playTriple],
  [PlayType.BOMB_N_TUPLE]: [
    playBomb4,
    playBomb5,
    playBomb6,
    playBomb7,
    playBomb8,
  ],
} as const

function iterateImp({
  cardsByRank,
  plan = { score: 0, plays: [] },
  nowType = PLAY_TYPE_START,
  nowRank = A,
  context,
}: {
  cardsByRank: CardsByRank
  plan?: Plan
  nowType?: PlayType
  nowRank?: NaturalRank
  context: IteratorContext
}) {
  if (context.debug) {
    console.log(PlayType[nowType], nowRank)
  }
  const next = nextRank(nowRank)
  if (next == null) {
    const nextType = nextPlayType(nowType)
    if (nextType == null) {
      // When we reach the last type, the plan is ready to collect.
      context.collectPlan(playRestOfCardsAsSingles(plan, cardsByRank))
      return
    }
    // nextType != null
    // Iterate the next type, and restart rank.
    iterateImp({
      cardsByRank,
      plan,
      nowType: nextType,
      nowRank: undefined, // restart
      context,
    })
    return
  }
  // next != null
  iterateImp({
    nowType,
    nowRank: next,
    cardsByRank,
    plan,
    context,
  })
  PLAY_TYPE_FUNC[nowType]?.forEach((func) => {
    const result = func({ nowRank, cards: cardsByRank, plan, context })
    if (result == null) {
      return
    }
    iterateImp({ ...result, nowType, nowRank, context })
  })
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
