import React, { Fragment } from 'react'
import { View, Text, ScrollView, Image } from 'react-native'
import { SUIT, RANK } from './cardUtils'
import { TCard } from './types'
import { styles } from './CardsChooser'
import nekoImg from './imgs/neko-40x40.png'

export function Card({
  rank,
  suit,
  isStacked,
  disabled,
}: TCard & {
  isStacked?: boolean
  disabled?: boolean
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
      <Image
        source={{ uri: nekoImg }}
        style={{
          position: 'absolute',
          left: 'calc(50% - 20px)',
          top: 'calc(50% - 20px)',
          width: 40,
          height: 40,
        }}
      />
      {disabled && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
      )}
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
                <View style={{ width: 16 }} />
                <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                  {handNode}
                </View>
              </Fragment>
            )
          } else {
            return handNode
          }
        })}
    </ScrollView>
  )
}
