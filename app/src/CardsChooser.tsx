import React, { useState, useCallback } from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native'
import { RANKS, SUIT, RANK, SUITS, SUITS_JOKER } from './constants'
import { CardState, TCard } from './types'

function useIncDecState(defaultValue = 0) {
  const [value, setValue] = useState(defaultValue)
  const increase = useCallback(() => setValue(valueNow => valueNow + 1), [
    setValue,
  ])
  const decrease = useCallback(() => setValue(valueNow => valueNow - 1), [
    setValue,
  ])

  return {
    value,
    increase,
    decrease,
  }
}

function Card({ rank, suit, isStacked }: TCard & { isStacked?: boolean }) {
  const rankDef = RANK[rank]
  const suitDef = SUIT[suit]

  return (
    <View style={[styles.card, isStacked && styles.cardStacked]}>
      <Text
        style={{
          fontSize: 24,
          color: suitDef.color,
        }}
      >
        {suitDef.label + rankDef.label}
      </Text>
    </View>
  )
}

export function CardsChooser({ cards, addCard, clearCards }: CardState) {
  const {
    value: rankID,
    increase: incRank,
    decrease: decRank,
  } = useIncDecState()

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cards.map((card, index) => (
          <Card key={card.rank + card.suit + index} {...card} isStacked />
        ))}
      </View>
      <View>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}
        >
          {(RANKS[rankID].isJoker ? SUITS_JOKER : SUITS).map(suit => (
            <TouchableOpacity
              key={suit.value}
              onPress={() =>
                addCard({
                  suit: suit.value,
                  rank: RANKS[rankID].value,
                })
              }
            >
              <Card suit={suit.value} rank={RANKS[rankID].value} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={decRank} title="<" disabled={rankID <= 0} />
        <Text>{RANKS[rankID].label}</Text>
        <Button
          onPress={incRank}
          title=">"
          disabled={rankID >= RANKS.length - 1}
        />
        <Button
          onPress={clearCards}
          title="清除"
          disabled={cards.length === 0}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 162,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  cardStacked: {
    marginRight: -60,
  },
})
