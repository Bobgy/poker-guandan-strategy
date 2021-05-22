import { A, K, Q } from './models/const'
import { Plan } from './models/Plan'
import { Play, PlayType } from './models/Play'

// returns score, the smaller the better
export type Scorer = (plan: Plan) => number
export const handsScore: Scorer = (plan) => plan.score
export const MAX_SCORE = 1e100

export const heuristicScore: Scorer = (plan) => {
  const scoreByPlayType: Partial<Record<PlayType, number>> = {}
  plan.plays.forEach((play) => {
    scoreByPlayType[play.playRank.type] =
      scoreByPlayType[play.playRank.type] || 0
    scoreByPlayType[play.playRank.type]! += heuristicScorePlay(play)
  })
  scoreByPlayType[PlayType.SINGLE] = cap(
    scoreByPlayType[PlayType.SINGLE],
    -3,
    MAX_SCORE,
  )
  scoreByPlayType[PlayType.PAIR] = cap(scoreByPlayType[PlayType.PAIR], -2, 6)
  scoreByPlayType[PlayType.TRIPLE] = cap(
    scoreByPlayType[PlayType.TRIPLE],
    -0.3,
    6,
  )
  scoreByPlayType[PlayType.FULL_HOUSE] = cap(
    scoreByPlayType[PlayType.FULL_HOUSE],
    -1.3,
    3,
  )
  scoreByPlayType[PlayType.STRAIGHT] = cap(
    scoreByPlayType[PlayType.STRAIGHT],
    -0.8,
    1.5,
  )
  scoreByPlayType[PlayType.TUBE] = cap(scoreByPlayType[PlayType.TUBE], -0.3, 1)
  scoreByPlayType[PlayType.PLATE] = cap(
    scoreByPlayType[PlayType.PLATE],
    -0.2,
    0.3,
  )
  return (
    Object.values(scoreByPlayType).reduce(
      (sum, value) => (sum || 0) + (value || 0),
    ) || 0
  )
}

function heuristicScorePlay(play: Play) {
  const playRank = play.playRank
  switch (playRank.type) {
    case PlayType.SINGLE:
      switch (playRank.rank) {
        case 14: // Red Joker
          return -1
        case 13: // Black Joker
          return -0.8
        default:
          return linear({ x: 0, y: 1 }, { x: 12, y: -0.2 }, playRank.rank)
      }
    case PlayType.PAIR:
      switch (playRank.rank) {
        case 14: // Red Joker
          return -1
        case 13: // Black Joker
          return -0.95
        default:
          // powerRank == 9 means J when A is main.
          if (playRank.rank >= 9) {
            return linear({ x: 9, y: 0 }, { x: 12, y: -0.9 }, playRank.rank)
          } else {
            return linear({ x: 9, y: 0 }, { x: 0, y: 1 }, playRank.rank)
          }
      }
    case PlayType.TRIPLE:
      if (playRank.rank >= 9) {
        return linear({ x: 9, y: 0 }, { x: 12, y: -1 }, playRank.rank)
      } else {
        return linear({ x: 9, y: 0 }, { x: 0, y: 1 }, playRank.rank)
      }
    case PlayType.FULL_HOUSE:
      if (playRank.rank >= 8) {
        return linear({ x: 8, y: 0 }, { x: 12, y: -1 }, playRank.rank)
      } else {
        return linear({ x: 8, y: 0 }, { x: 0, y: 1 }, playRank.rank)
      }
    case PlayType.STRAIGHT:
      if (playRank.rank >= 7) {
        return linear({ x: 7, y: 0 }, { x: 10, y: -1 }, playRank.rank)
      } else {
        return linear({ x: 7, y: 0 }, { x: A, y: 0.8 }, playRank.rank)
      }
    case PlayType.TUBE:
      if (playRank.rank >= 8) {
        return linear({ x: 8, y: 0 }, { x: Q, y: -1 }, playRank.rank)
      } else {
        return linear({ x: 8, y: 0 }, { x: A, y: 0.5 }, playRank.rank)
      }
    case PlayType.PLATE:
      if (playRank.rank >= 6) {
        return linear({ x: 6, y: 0 }, { x: K, y: -1 }, playRank.rank)
      } else {
        return linear({ x: 6, y: 0 }, { x: A, y: 0.3 }, playRank.rank)
      }
    case PlayType.STRAIGHT_FLUSH:
    case PlayType.BOMB_N_TUPLE:
    case PlayType.FOUR_JOKER:
      return -1
    default:
      throw new Error('Unknown play rank type')
  }
}

// There's a straight line connecting start point and end point.
// Returns the y value of queried x value.
function linear(
  start: { x: number; y: number },
  end: { x: number; y: number },
  x: number,
) {
  return ((end.y - start.y) / (end.x - start.x)) * (x - start.x) + start.y
}

function cap(x: number | undefined, min: number, max: number) {
  if (x == null) {
    return 0
  }
  if (x < min) {
    return min
  }
  if (x > max) {
    return max
  }
  return x
}
