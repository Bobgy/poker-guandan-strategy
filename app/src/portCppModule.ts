import { CppModule, StrategyResult, vector2Array } from './loadCppModule'

export function portCppModule(cppModule: CppModule) {
  return {
    calc: (cards: string, mainRank: string): StrategyResult => {
      const { minHands, solutions: originalSolutions } = cppModule.calc(
        cards,
        mainRank.charCodeAt(0),
      )
      const solutionsRaw = vector2Array(originalSolutions)
      return {
        minHands,
        solutionsRaw,
        solutions: parseSolutions(solutionsRaw),
      }
    },
  }
}

const cardRegex = /[0-9A-Z]{2}/

// TODO: write this more elegantly
export function restoreWildCards(
  hands: string[][],
  usedWildCards: string[],
  wildCard: string,
): string[][] {
  const wildCardsToUse = [...usedWildCards]
  const restoredHands = [...hands]

  hands.forEach((hand, handID) => {
    hand.forEach((card, cardID) => {
      if (wildCardsToUse.length > 0) {
        const foundCardID = wildCardsToUse.indexOf(card)
        if (foundCardID >= 0) {
          wildCardsToUse.splice(foundCardID, 1)
          const newHand = [...restoredHands[handID]]
          newHand.splice(cardID, 1, wildCard)
          restoredHands[handID] = newHand
        }
      }
    })
  })

  if (wildCardsToUse.length > 0) {
    throw new Error(
      `Cannot find all wildcards, double check the data, hands = "${hands}", usedWildCards = "${usedWildCards}", wildCard="${wildCard}"`,
    )
  }

  return restoredHands
}

export function parseSolutions(solutions: string[]) {
  if (solutions.length % 2 !== 0) {
    throw new Error(
      'solutions wrong format, it should have even lines, every 2 lines show a solution',
    )
  }

  const parsedSolutions = []

  for (let i = 0; i < solutions.length; i += 2) {
    const wildCardsRawStr = solutions[i]
    const handsRawStr = solutions[i + 1]
    const asHands = handsRawStr
      .split('|')
      .map(hand => hand.split(' ').filter(str => str.match(cardRegex)))
      .filter(foundCards => foundCards.length > 0)
    const wildCards = wildCardsRawStr
      .split(' ')
      .filter(str => str.match(cardRegex))
    const actualHands = restoreWildCards(asHands, wildCards, '??')

    parsedSolutions.push({
      wildCards,
      actualHands,
      asHands,
    })
  }
  console.log(parsedSolutions)

  return parsedSolutions
}
