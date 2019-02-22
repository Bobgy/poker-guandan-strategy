import React, { useState, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native'
import { RANKS, SUITS, SUITS_JOKER, canIAddCard } from './cardUtils'
import { CardState, TCard } from './types'
import { Divider } from './Divider'
import { CardDeck, Card } from './Card'
import { MyButton } from './MyButton'

const palette = {
  blue: 'rgb(33, 150, 243)',
  grey: {
    0: 'black',
    4: 'rgb(161, 161, 161)',
    6: 'rgb(223, 223, 223)',
    8: 'white',
  },
}

export const theme = {
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

const controlStyles = StyleSheet.create({
  incDecButton: {
    flex: 2,
    minWidth: 80,
    maxWidth: 200,
    margin: 6,
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
    maxWidth: 150,
    margin: 6,
  },
  buttonTitle: {
    fontSize: 20,
  },
  buttonTitleSmall: {
    fontSize: 20,
  },
})
interface ControlPanelProps {
  decRank: () => void
  incRank: () => void
  clearCards: () => void
  randomCards: () => void
  deleteLastCard: () => void
  rankID: number
  numberOfCards: number
}
const ControlPanel: React.FunctionComponent<ControlPanelProps> = props => (
  <View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <MyButton
        onPress={props.decRank}
        disabled={props.rankID <= 0}
        title="<"
        style={controlStyles.incDecButton}
        titleStyle={controlStyles.buttonTitle}
      />
      <MyButton
        onPress={props.incRank}
        title=">"
        disabled={props.rankID >= RANKS.length - 1}
        style={controlStyles.incDecButton}
        titleStyle={controlStyles.buttonTitle}
      />
    </View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <MyButton
        onPress={props.randomCards}
        title="随机发牌"
        disabled={props.numberOfCards > 0}
        style={controlStyles.actionButton}
        titleStyle={controlStyles.buttonTitleSmall}
      />
      <MyButton
        onPress={props.clearCards}
        title="清除"
        disabled={props.numberOfCards === 0}
        style={controlStyles.actionButton}
        titleStyle={controlStyles.buttonTitle}
      />
      <MyButton
        onPress={props.deleteLastCard}
        title="删除"
        disabled={props.numberOfCards === 0}
        style={controlStyles.actionButton}
        titleStyle={controlStyles.buttonTitle}
      />
    </View>
  </View>
)

interface AddCardPanelProps {
  cards: TCard[]
  addCard: (card: TCard) => void
  rankID: number
}
const AddCardPanel: React.FunctionComponent<AddCardPanelProps> = props => (
  <>
    {(RANKS[props.rankID].isJoker ? SUITS_JOKER : SUITS).map(suit => {
      const card = {
        suit: suit.value,
        rank: RANKS[props.rankID].value,
      }
      const canIAddThisCard = canIAddCard(props.cards, card)

      return (
        <TouchableOpacity
          key={suit.value}
          onPress={() => props.addCard(card)}
          disabled={!canIAddThisCard}
        >
          <Card
            suit={suit.value}
            rank={RANKS[props.rankID].value}
            disabled={!canIAddThisCard}
            style={{ margin: 3 }}
          />
        </TouchableOpacity>
      )
    })}
  </>
)

export function CardsChooser({
  cards,
  addCard,
  clearCards,
  randomCards,
  deleteLastCard,
}: CardState) {
  const {
    value: rankID,
    increase: incRank,
    decrease: decRank,
  } = useIncDecState()

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CardDeck
          cards={cards}
          style={{
            height: 60,
            padding: 6,
          }}
        />
      </View>
      <Divider />
      <Text style={{ fontSize: 14, margin: 4 }}>{`点击扑克牌添加，目前已有${
        cards.length
      }张牌`}</Text>
      <ScrollView
        style={{
          height: 110,
          flexGrow: 0,
        }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
        horizontal
      >
        <AddCardPanel cards={cards} addCard={addCard} rankID={rankID} />
      </ScrollView>
      <ControlPanel
        numberOfCards={cards.length}
        clearCards={clearCards}
        randomCards={randomCards}
        deleteLastCard={deleteLastCard}
        rankID={rankID}
        incRank={incRank}
        decRank={decRank}
      />
    </View>
  )
}
