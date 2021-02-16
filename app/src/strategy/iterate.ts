import { Card } from './models/Card'
import { A, K, NaturalRank, nextRank } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import { Play, PlayType } from './models/Play'

const PLAY_TYPE_START = PlayType.STRAIGHT
const NEXT_PLAY_TYPE: { [T in PlayType]?: PlayType } = {
  [PlayType.STRAIGHT]: PlayType.BOMB_N_TUPLE,
  [PlayType.BOMB_N_TUPLE]: PlayType.TRIPLE,
  [PlayType.TRIPLE]: PlayType.PAIR,
  [PlayType.PAIR]: undefined,
} as const
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
export const TEST_ONLY = { organize }

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
      score: plan.score + (n > 3 ? /* Bomb is free to play. */ 0 : 1),
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
const playCardSequence = ({
  cardCount,
  length,
}: {
  cardCount: number
  length: number
}): PlayTypeFunc => ({ cards: cardsByRank, nowRank, plan, context }) => {
  if (context.debug) {
    console.log(`playCardSequence: ${JSON.stringify(cardsByRank)}, ${nowRank}`)
  }
  const end = nowRank + length - 1
  if (end > K + 1) {
    // This sequence is not possible, because it cannot go past A.
    return undefined
  }
  for (let i = nowRank; i <= end; ++i) {
    const ii = i == K + 1 ? A : i
    if (!cardsByRank[ii] || cardsByRank[ii]!.length < cardCount) {
      return undefined
    }
  }
  let newCardsByRank = { ...cardsByRank }
  let play: Play = {
    cards: [],
    playRank: { type: PlayType.STRAIGHT, rank: context.game.getOrder(nowRank) },
  }
  for (let i = nowRank; i <= end; ++i) {
    const ii = i == K + 1 ? A : i
    const cards = cardsByRank[ii]
    if (!cards || cards.length < cardCount) {
      return undefined
    }
    newCardsByRank[ii] = cards.slice(cardCount)
    play.cards.push(...cards.slice(0, cardCount))
  }
  return {
    cardsByRank: newCardsByRank,
    plan: {
      score: plan.score + 1,
      plays: plan.plays.concat(play),
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
export const playStraight = playCardSequence({ cardCount: 1, length: 5 })
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
  [PlayType.STRAIGHT]: [playStraight],
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
