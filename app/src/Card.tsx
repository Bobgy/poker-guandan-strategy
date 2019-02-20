import React, { Fragment } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SUIT, RANK } from './cardUtils'
import { TCard } from './types'
import { styles } from './CardsChooser'

export function Card({
  rank,
  suit,
  isStacked,
}: TCard & {
  isStacked?: boolean
}) {
  const rankDef = RANK[rank]
  const suitDef = SUIT[suit]
  return (
    <View style={[styles.card, isStacked && styles.cardStacked]}>
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          color: suitDef.color,
          lineHeight: 16,
          textAlign: 'center',
          width: 20,
          marginTop: 4,
          fontWeight: 'bold',
        }}
      >
        {rankDef.label === '10'
          ? rankDef.label
          : rankDef.label.split('').join('\n')}
        {'\n'}
        {suitDef.label}
      </Text>
    </View>
  )
}

interface CardDeckProps {
  cards?: TCard[]
  hands?: TCard[][]
}

export const CardDeck: React.FunctionComponent<CardDeckProps> = ({
  cards,
  hands,
}) => {
  return (
    <ScrollView
      style={{
        flex: 1,
        minHeight: 60,
      }}
      contentContainerStyle={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingRight: 60,
        paddingBottom: 60,
        overflow: 'hidden',
      }}
    >
      {!!cards &&
        cards.map((card, index) => (
          <Card key={card.rank + card.suit + index} {...card} isStacked />
        ))}
      {!!hands &&
        hands.map((hand, handID) => {
          const handNode = hand.map((card, cardID) => (
            <Card key={card.rank + card.suit + cardID} {...card} isStacked />
          ))

          if (handID > 0) {
            // add separator
            return (
              <Fragment key={handID}>
                <View style={{ width: 20 }} />
                {handNode}
              </Fragment>
            )
          } else {
            return handNode
          }
        })}
    </ScrollView>
  )
}
