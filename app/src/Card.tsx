import React, { Fragment } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { SUIT, RANK } from './cardUtils'
import { TCard } from './types'
import nekoImg from './imgs/neko-40x40.png'

const STACKED_CARD_MARGIN = 52

const styles = StyleSheet.create({
  card: {
    width: 74,
    height: 100,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 4,
  },
  cardStacked: {
    marginRight: -STACKED_CARD_MARGIN,
    marginBottom: -STACKED_CARD_MARGIN,
  },
})

export function Card({
  rank,
  suit,
  isStacked,
  disabled,
  style,
}: TCard & {
  isStacked?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const rankDef = RANK[rank]
  const suitDef = SUIT[suit]
  return (
    <View style={[styles.card, isStacked && styles.cardStacked, style]}>
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

const HAND_MARGIN = 13
const CONTAINER_PADDING = 0

interface CardDeckProps {
  cards?: TCard[]
  hands?: TCard[][]
  style?: StyleProp<ViewStyle>
}
export const CardDeck: React.FunctionComponent<CardDeckProps> = ({
  cards,
  hands,
  style,
}) => {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: CONTAINER_PADDING,
        paddingRight: STACKED_CARD_MARGIN + CONTAINER_PADDING, // cancel margin of hands
        paddingBottom: STACKED_CARD_MARGIN + CONTAINER_PADDING,
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
            // no wrapping
            return (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  marginRight: HAND_MARGIN,
                }}
                key={handID}
              >
                {handNode}
              </View>
            )
          } else {
            // initial hand can be long, allow wrapping as normal
            return (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginRight: HAND_MARGIN,
                  maxWidth: '100%', // set max width to enable wrapping
                }}
                key={handID}
              >
                {handNode}
              </View>
            )
          }
        })}
    </ScrollView>
  )
}
