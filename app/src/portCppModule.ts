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
  try {
    return parseSolutionsUnsafe(solutions)
  } catch (e) {
    console.log(solutions)
    throw e
  }
}

export function parseSolutionsUnsafe(solutions: string[]) {
  const parsedSolutions = []
  let wildCards: null | string[] = null

  for (let i = 0; i < solutions.length; ++i) {
    if (solutions[i].length === 0) {
      throw new Error("solutions shouldn't have empty line: #" + i)
    }

    if (solutions[i][0] === '-') {
      // section of wild cards
      const wildCardsRawStr = solutions[i]
      wildCards = wildCardsRawStr.split(' ').filter(str => str.match(cardRegex))
    } else {
      // section of a solution
      if (wildCards == null) {
        throw new Error(
          'wildcard definition should be before solution definition',
        )
      }

      const handsRawStr = solutions[i]
      const asHands = handsRawStr
        .split('|')
        .map(hand => hand.split(' ').filter(str => str.match(cardRegex)))
        .filter(foundCards => foundCards.length > 0)
      const actualHands = restoreWildCards(asHands, wildCards, '??')

      parsedSolutions.push({
        wildCards,
        actualHands,
        asHands,
      })
    }
  }
  // console.log(parsedSolutions)

  return parsedSolutions
}
