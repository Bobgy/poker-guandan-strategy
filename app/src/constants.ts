export const RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  {
    value: '0',
    label: '10',
    isJoker: false,
  },
  'J',
  'Q',
  'K',
  'A',
  {
    value: 'X',
    label: 'Joker',
    isJoker: true,
  },
].map(data => {
  if (typeof data === 'object') {
    return data
  } else {
    const rank = data
    return {
      label: rank,
      value: rank,
      isJoker: false,
    }
  }
})
interface RankIndex {
  [rank: string]: {
    value: string
    label: string
    isJoker: boolean
  }
}
export const RANK: RankIndex = RANKS.reduce((rankIndex: RankIndex, rank) => {
  rankIndex[rank.value] = rank
  return rankIndex
}, {})
interface SuiteIndex {
  [suit: string]: {
    value: string
    label: string
    color: string
  }
}
export const SUIT: SuiteIndex = {
  H: {
    value: 'H',
    label: '♥',
    color: 'red',
  },
  D: {
    value: 'D',
    label: '♦',
    color: 'red',
  },
  S: {
    value: 'S',
    label: '♠',
    color: 'black',
  },
  C: {
    value: 'C',
    label: '♣',
    color: 'black',
  },
  B: {
    // black joker
    value: 'B',
    label: '',
    color: 'black',
  },
  R: {
    // red joker
    value: 'R',
    label: '',
    color: 'red',
  },
}
export const SUITS = [SUIT.H, SUIT.S, SUIT.C, SUIT.D]
export const SUITS_JOKER = [SUIT.B, SUIT.R]
