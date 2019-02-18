import React, { useState, useCallback } from 'react'
import { View, Text, Picker } from 'react-native'
import { RANKS } from './constants'
import { CardState, RankState } from './types'

export function useCardState(): CardState {
  const [cards, setCards] = useState([])
  const clearCards = useCallback(() => setCards([]), [setCards])
  const addCard = useCallback(
    card => setCards(cardsNow => cardsNow.concat(card)),
    [setCards],
  )
  return {
    cards,
    clearCards,
    addCard,
  }
}

export function RankChooser({ rank, setRank }: RankState) {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <Text style={{ fontSize: 22, marginHorizontal: 6 }}>当前打</Text>
      <Picker
        selectedValue={rank}
        onValueChange={itemValue => setRank(itemValue)}
      >
        {RANKS.filter(rankOption => !rankOption.isJoker).map(rankOption => (
          <Picker.Item
            key={rankOption.value}
            label={rankOption.label}
            value={rankOption.value}
          />
        ))}
      </Picker>
    </View>
  )
}
