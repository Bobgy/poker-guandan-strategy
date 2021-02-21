import { DEBUG } from './const'
import { Card } from './models/Card'
import { A, K, NaturalRank, nextRank } from './models/const'
import { GameContext } from './models/GameContext'
import { Plan } from './models/Plan'
import {
  Play,
  PlayRankBombNTuple,
  PlayRankNormal,
  PlayType,
} from './models/Play'
import { getNextSuit, Suit, SUIT_START } from './models/Suite'

const NEXT_PLAY_TYPE: { [T in PlayType]?: PlayType } = {
  [PlayType.STRAIGHT_FLUSH]: PlayType.BOMB_N_TUPLE,
  [PlayType.BOMB_N_TUPLE]: PlayType.PLATE,
  [PlayType.PLATE]: PlayType.TUBE,
  [PlayType.TUBE]: PlayType.STRAIGHT,
  [PlayType.STRAIGHT]: PlayType.PAIR,
  [PlayType.PAIR]: PlayType.TRIPLE,
  [PlayType.TRIPLE]: undefined,
} as const
function nextPlayType(playType: PlayType): PlayType | undefined {
  return NEXT_PLAY_TYPE[playType]
}
type IteratorState = {
  rank: NaturalRank
  suit?: Suit
  type: PlayType
}
export const ITERATOR_STATE_START: IteratorState = {
  rank: A,
  suit: SUIT_START,
  type: PlayType.STRAIGHT_FLUSH,
}
export function nextIteratorState(
  now: IteratorState,
): IteratorState | undefined {
  const next = nextRank(now.rank)
  if (next != null) {
    return {
      ...now,
      rank: next,
    }
  }
  if (now.suit) {
    console.assert(now.type === PlayType.STRAIGHT_FLUSH)
    const nextSuit = getNextSuit(now.suit)
    if (nextSuit != null) {
      return {
        ...now,
        rank: A,
        suit: nextSuit,
      }
    }
  }
  // next == null
  const nextType = nextPlayType(now.type)
  if (nextType != null) {
    // Iterate the next type, and restart rank.
    return {
      ...now,
      rank: A, // restart
      type: nextType,
      suit: undefined, // STRAIGHT_FLUSH is the only type with suit, so next type won't have suit
    }
  }
  // nextType == null
  return undefined
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
  const cardsByRank = organize(cards, gameContext)
  iterateImp({
    cardsByRank,
    context: {
      collectPlan,
      game: gameContext,
      debug: DEBUG,
    },
  })
}

type RankWildCard = 0
const WILD_CARD: RankWildCard = 0
type CardsByRank = { [R in NaturalRank | RankWildCard]?: Card[] }
function organize(cards: Card[], context: GameContext): CardsByRank {
  const organized: CardsByRank = {}
  cards.forEach((card) => {
    const rank = context.isWildCard(card) ? WILD_CARD : card.rank.natural
    organized[rank] = organized[rank] || []
    organized[rank]!.push(card)
  })
  return organized
}
export const TEST_ONLY = { organize }
function takeCard(
  cards: CardsByRank, // Warning: this will mutate cards.
  rank: NaturalRank,
  count: number = 1,
): Card[] | undefined {
  console.assert(count >= 1)
  const rankCards = cards[rank] || []
  if (count <= rankCards.length) {
    const taken = rankCards.slice(0, count)
    cards[rank] = rankCards.slice(count)
    return taken
  }
  const wildCards = cards[WILD_CARD]
  const wildCardsNeeded = count - rankCards.length
  if (!wildCards || wildCardsNeeded > wildCards.length) {
    return undefined
  }
  const taken = rankCards.concat(wildCards.slice(0, wildCardsNeeded))
  cards[rank] = []
  cards[WILD_CARD] = wildCards.slice(wildCardsNeeded)
  return taken
}
function takeCardBySuit(
  cardsByRank: CardsByRank,
  rank: NaturalRank,
  suit: Suit,
): Card | undefined {
  const rankCards = cardsByRank[rank] || []
  const index = rankCards.findIndex((card) => card.suit === suit)
  if (index >= 0) {
    cardsByRank[rank] = [...rankCards] // splice modifies the array, so copy it first
    cardsByRank[rank]!.splice(index, 1)
    return rankCards[index]
  }
  const wildCards = cardsByRank[WILD_CARD] || []
  if (wildCards.length > 0) {
    cardsByRank[WILD_CARD] = wildCards.slice(1)
    return wildCards[0]
  }
  // not found
  return undefined
}

type IteratorContext = {
  game: GameContext
  collectPlan: PlanCollector
  debug?: boolean
}

type PlayTypeFunc = (args: {
  cards: CardsByRank
  nowRank: NaturalRank
  nowSuit?: Suit
  plan: Plan
  context: IteratorContext
}) => { cardsByRank: CardsByRank; plan: Plan } | undefined
const playCardsOfTheSameRank = (n: number): PlayTypeFunc => ({
  cards,
  nowRank,
  plan,
  context,
}) => {
  const newCards = { ...cards }
  const taken = takeCard(newCards, nowRank, n)
  if (taken == null) {
    return undefined
  }
  const playRank: PlayRankBombNTuple | PlayRankNormal = {
    type:
      n === 2
        ? PlayType.PAIR
        : n === 3
        ? PlayType.TRIPLE
        : PlayType.BOMB_N_TUPLE,
    rank: context.game.getOrder(nowRank),
    cardCount: n,
  }
  return {
    cardsByRank: newCards,
    plan: {
      score: plan.score + (n > 3 ? /* Bomb is free to play. */ 0 : 1),
      plays: plan.plays.concat({
        playRank,
        cards: taken,
      }),
    },
  }
}
const playCardSequence = ({
  cardCount,
  length,
  playType,
}: {
  cardCount: number
  length: number
  playType: PlayType.TUBE | PlayType.STRAIGHT | PlayType.PLATE
}): PlayTypeFunc => ({ cards: cardsByRank, nowRank, plan, context }) => {
  if (context.debug) {
    console.log(`playCardSequence: ${JSON.stringify(cardsByRank)}, ${nowRank}`)
  }
  const end = nowRank + length - 1
  if (end > K + 1) {
    // This sequence is not possible, because it cannot go past A.
    return undefined
  }
  let newCardsByRank = { ...cardsByRank }
  let play: Play = {
    cards: [],
    playRank: { type: playType, rank: nowRank },
  }
  for (let i = nowRank; i <= end; ++i) {
    const ii = i == K + 1 ? A : i
    const taken = takeCard(newCardsByRank, ii, cardCount)
    if (taken == null) {
      return undefined
    }
    play.cards.push(...taken)
  }
  return {
    cardsByRank: newCardsByRank,
    plan: {
      score: plan.score + 1,
      plays: plan.plays.concat(play),
    },
  }
}
const playStraightFlush: PlayTypeFunc = ({
  cards: cardsByRank,
  nowRank,
  nowSuit,
  plan,
  context,
}) => {
  if (context.debug) {
    console.log(
      `playStraightFlush: ${JSON.stringify(
        cardsByRank,
      )}, ${nowRank}, ${nowSuit}`,
    )
  }
  if (!nowSuit) {
    // playStraightFlush should always be called with suit
    console.assert(nowSuit)
    return undefined
  }
  const end = nowRank + 5 - 1
  if (end > K + 1) {
    // This sequence is not possible, because it cannot go past A.
    return undefined
  }
  let newCardsByRank = { ...cardsByRank }
  let play: Play = {
    cards: [],
    playRank: { type: PlayType.STRAIGHT_FLUSH, rank: nowRank },
  }
  for (let i = nowRank; i <= end; ++i) {
    const ii = i == K + 1 ? A : i
    const taken = takeCardBySuit(newCardsByRank, ii, nowSuit)
    if (taken == null) {
      // not found
      return undefined
    }
    play.cards.push(taken)
  }
  return {
    cardsByRank: newCardsByRank,
    plan: {
      score: plan.score + 0, // straight flush is a bomb
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
const playFullHouse: PlayTypeFunc = ({ cards, nowRank, plan, context }) => {
  const result = playTriple({ cards, nowRank, plan, context })
  if (result == null) {
    return undefined
  }
  const { cardsByRank: newCards, plan: newPlan } = result
  const pairIndex = newPlan.plays.findIndex(
    (play) => play.playRank.type === PlayType.PAIR,
  )
  if (pairIndex < 0) {
    // No pairs left, cannot make a full house.
    return undefined
  }
  const triplePlay = newPlan.plays[newPlan.plays.length - 1] as Play
  const pairPlay = newPlan.plays[pairIndex]
  // Remove pair and triple.
  newPlan.plays = newPlan.plays
    .slice(0, pairIndex)
    .concat(newPlan.plays.slice(pairIndex + 1, newPlan.plays.length - 1))
  // Push a full house.
  newPlan.plays.push({
    playRank: {
      type: PlayType.FULL_HOUSE,
      rank: (triplePlay.playRank as PlayRankNormal).rank,
    },
    cards: triplePlay.cards.concat(pairPlay.cards),
  })
  // Pair and triple becomes a full house, one fewer hand to play.
  newPlan.score = newPlan.score - 1
  return { plan: newPlan, cardsByRank: newCards }
}
export const playStraight = playCardSequence({
  cardCount: 1,
  length: 5,
  playType: PlayType.STRAIGHT,
})
const playTube = playCardSequence({
  cardCount: 2,
  length: 3,
  playType: PlayType.TUBE,
})
const playPlate = playCardSequence({
  cardCount: 3,
  length: 2,
  playType: PlayType.PLATE,
})
const PLAY_TYPE_FUNC: { [T in PlayType]?: readonly PlayTypeFunc[] } = {
  [PlayType.PAIR]: [playPair],
  [PlayType.TRIPLE]: [playTriple, playFullHouse],
  [PlayType.BOMB_N_TUPLE]: [
    playBomb4,
    playBomb5,
    playBomb6,
    playBomb7,
    playBomb8,
  ],
  [PlayType.STRAIGHT]: [playStraight],
  [PlayType.TUBE]: [playTube],
  [PlayType.PLATE]: [playPlate],
  [PlayType.STRAIGHT_FLUSH]: [playStraightFlush],
} as const

function iterateImp({
  cardsByRank,
  plan = { score: 0, plays: [] },
  now = ITERATOR_STATE_START,
  context,
}: {
  cardsByRank: CardsByRank
  plan?: Plan
  now?: IteratorState
  context: IteratorContext
}) {
  if (context.debug) {
    console.log(PlayType[now.type], now.rank, now.suit)
  }
  PLAY_TYPE_FUNC[now.type]?.forEach((func) => {
    const result = func({
      nowRank: now.rank,
      nowSuit: now.suit,
      cards: cardsByRank,
      plan,
      context,
    })
    if (result == null) {
      return
    }
    iterateImp({ ...result, now, context })
  })
  const next = nextIteratorState(now)
  if (next == null) {
    // When we reach the last iterator state, the plan is ready to collect.
    context.collectPlan(playRestOfCardsAsSingles(plan, cardsByRank))
    return
  }
  // next != null
  iterateImp({
    now: next,
    cardsByRank,
    plan,
    context,
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
