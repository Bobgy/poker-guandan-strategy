import { useCallback, useState } from 'react'
import { generateRandomHands } from './common/cardUtils'
import { CardState } from './common/types'
import { CardRaw } from './strategy/models/const'

export function useCardState(): CardState {
  const [cards, setCards] = useState<CardRaw[]>([])
  const clearCards = useCallback(() => setCards([]), [setCards])
  const addCard = useCallback(
    (card) => setCards((cardsNow) => cardsNow.concat(card)),
    [setCards],
  )
  const randomCards = useCallback(() => setCards(generateRandomHands()), [
    setCards,
  ])
  const deleteLastCard = useCallback(
    () => setCards((cardsNow) => cardsNow.slice(0, cardsNow.length - 1)),
    [setCards],
  )
  return {
    cards,
    clearCards,
    addCard,
    randomCards,
    deleteLastCard,
  }
}
