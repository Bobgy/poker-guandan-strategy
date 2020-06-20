import React, { useState, useCallback } from 'react'
import { View, Text, Picker } from 'react-native'
import { RANKS, RANK, generateRandomHands } from './common/cardUtils'
import { SUIT } from './strategy/models/Suite'
import { CardState, RankState, TCard } from './common/types'

export function useCardState(): CardState {
  const [cards, setCards] = useState<TCard[]>([])
  const clearCards = useCallback(() => setCards([]), [setCards])
  const addCard = useCallback(
    card => setCards(cardsNow => cardsNow.concat(card)),
    [setCards],
  )
  const randomCards = useCallback(() => setCards(generateRandomHands()), [
    setCards,
  ])
  const deleteLastCard = useCallback(
    () => setCards(cardsNow => cardsNow.slice(0, cardsNow.length - 1)),
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
