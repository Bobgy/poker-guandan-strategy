import { parseSolutions, restoreWildCards } from './portCppModule'

describe('parseSolutions should parse solutions generated from cpp module', () => {
  it('works', () => {
    expect(
      parseSolutions([
        '------------- 2S ------------',
        '| || 2S 3S 4S 5C 6S || 2S 3C 4S 5C 6S |',
      ]),
    ).toEqual([
      {
        wildCards: ['2S'],
        asHands: [
          ['2S', '3S', '4S', '5C', '6S'],
          ['2S', '3C', '4S', '5C', '6S'],
        ],
        actualHands: [
          ['??', '3S', '4S', '5C', '6S'],
          ['2S', '3C', '4S', '5C', '6S'],
        ],
      },
    ])
  })

  it('works with multiple cards', () => {
    expect(
      parseSolutions([
        '------------- 2S 5C ------------',
        '| || 2S 3S 4S 5D 6S || 2C 3C 4C 5C 6C |',
      ]),
    ).toEqual([
      {
        wildCards: ['2S', '5C'],
        asHands: [
          ['2S', '3S', '4S', '5D', '6S'],
          ['2C', '3C', '4C', '5C', '6C'],
        ],
        actualHands: [
          ['??', '3S', '4S', '5D', '6S'],
          ['2C', '3C', '4C', '??', '6C'],
        ],
      },
    ])
  })
})

describe('restoreWildCards should work', () => {
  it('works with simplest case', () => {
    expect(restoreWildCards([['2S']], ['2S'], '4H')).toEqual([['4H']])
  })

  it('works when there are more than 1 cards', () => {
    expect(restoreWildCards([['2S', '5H', '6D']], ['5H', '2S'], '4H')).toEqual([
      ['4H', '4H', '6D'],
    ])
  })
})
