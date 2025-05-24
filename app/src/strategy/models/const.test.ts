import { parseRawCards } from './const'

describe('parseRawCards', () => {
  it('should parse red joker', () => {
    expect(parseRawCards('RJ')).toEqual([{ rank: 15, suit: 'R' }])
  })
  it('should parse black joker', () => {
    expect(parseRawCards('BJ')).toEqual([{ rank: 14, suit: 'B' }])
  })
  it('should parse normal card', () => {
    expect(parseRawCards('SA')).toEqual([{ rank: 1, suit: 'S' }])
    expect(parseRawCards('H7')).toEqual([{ rank: 7, suit: 'H' }])
    expect(parseRawCards('D10')).toEqual([{ rank: 10, suit: 'D' }])
  })
  it('should parse multiple cards together', () => {
    expect(parseRawCards('RJSAH7D10BJ')).toEqual([
      { rank: 15, suit: 'R' },
      { rank: 1, suit: 'S' },
      { rank: 7, suit: 'H' },
      { rank: 10, suit: 'D' },
      { rank: 14, suit: 'B' },
    ])
  })
})
