import React, {
  useState,
  useCallback,
  FunctionComponent,
  ReactPropTypes,
  ReactNode,
} from 'react'
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
} from 'react-native'
import { RANKS, SUIT, RANK, SUITS, SUITS_JOKER } from './constants'
import { CardState, TCard } from './types'

const palette = {
  blue: 'rgb(33, 150, 243)',
  grey: {
    0: 'black',
    4: 'rgb(161, 161, 161)',
    6: 'rgb(223, 223, 223)',
    8: 'white',
  },
}

const theme = {
  disabled: {
    background: palette.grey[6],
    text: palette.grey[4],
  },
  button: {
    background: palette.blue,
  },
}

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

interface MyButtonProps extends TouchableOpacityProps {
  title: ReactNode
  textStyle?: StyleProp<TextStyle>
}

const MyButton: FunctionComponent<MyButtonProps> = ({
  style,
  textStyle,
  title,
  disabled,
  ...restProps
}) => (
  <TouchableOpacity
    style={[
      {
        backgroundColor: disabled
          ? theme.disabled.background
          : theme.button.background,
        borderRadius: 2,
        padding: 4,
        alignContent: 'center',
        justifyContent: 'center',
      },
      style,
    ]}
    disabled={disabled}
    {...restProps}
  >
    <Text
      style={[{ color: disabled ? theme.disabled.text : 'white' }, textStyle]}
    >
      {title}
    </Text>
  </TouchableOpacity>
)

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
        <MyButton onPress={decRank} disabled={rankID <= 0} title="<" />
        <Text>{RANKS[rankID].label}</Text>
        <MyButton
          onPress={incRank}
          title=">"
          disabled={rankID >= RANKS.length - 1}
        />
        <MyButton
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
