import React, { useCallback, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Card, CardDeck } from './Card'
import { canIAddCard } from './common/cardUtils'
import { CardState } from './common/types'
import { Divider } from './Divider'
import { MyButton } from './MyButton'
import {
  A,
  BLACK_JOKER,
  CardRaw,
  NaturalRank,
  NATURAL_RANK_MAX,
  NATURAL_RANK_MIN,
  RED_JOKER,
} from './strategy/models/const'
import {
  AllSuit,
  SuiteMetadata,
  SUITS,
  SUITS_JOKER,
} from './strategy/models/Suite'
import { WindowSize } from './useWindowSize'

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

function useRankState() {
  const { value, increase, decrease } = useIncDecState(A)
  return {
    rank: value as NaturalRank,
    incRank: increase,
    decRank: decrease,
  }
}

function useIncDecState(defaultValue = 0) {
  const [value, setValue] = useState(defaultValue)
  const increase = useCallback(() => setValue((valueNow) => valueNow + 1), [
    setValue,
  ])
  const decrease = useCallback(() => setValue((valueNow) => valueNow - 1), [
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
  rank: NaturalRank
  numberOfCards: number
}
const ControlPanel: React.FunctionComponent<ControlPanelProps> = (props) => (
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
        disabled={props.rank <= NATURAL_RANK_MIN}
        title="<"
        style={controlStyles.incDecButton}
        titleStyle={controlStyles.buttonTitle}
      />
      <MyButton
        onPress={props.incRank}
        title=">"
        disabled={props.rank >= NATURAL_RANK_MAX}
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
  cards: CardRaw[]
  addCard: (card: CardRaw) => void
  rank: NaturalRank
  large?: boolean
}
const AddCardPanel: React.FunctionComponent<AddCardPanelProps> = (props) => {
  const suits: SuiteMetadata<AllSuit>[] =
    props.rank === BLACK_JOKER || props.rank === RED_JOKER ? SUITS_JOKER : SUITS

  return (
    <>
      {suits.map((suit: SuiteMetadata<AllSuit>) => {
        const card = {
          suit: suit.value,
          rank: props.rank,
        } as CardRaw
        const canIAddThisCard = canIAddCard(props.cards, card)

        return (
          <TouchableOpacity
            key={suit.value}
            onPress={() => props.addCard(card)}
            disabled={!canIAddThisCard}
          >
            <Card
              suit={suit.value}
              rank={props.rank}
              disabled={!canIAddThisCard}
              style={{ margin: 3 }}
              large={props.large}
            />
          </TouchableOpacity>
        )
      })}
    </>
  )
}

export function CardsChooser({
  cards,
  addCard,
  clearCards,
  randomCards,
  deleteLastCard,
  windowSize,
}: CardState & {
  windowSize: WindowSize
}) {
  const { rank, incRank, decRank } = useRankState()

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CardDeck
          cards={cards}
          style={{
            height: 60,
            padding: 6,
          }}
          large={windowSize === 'BIG'}
        />
      </View>
      <Divider />
      <Text
        style={{ fontSize: 14, margin: 4 }}
      >{`点击扑克牌添加，目前已有${cards.length}张牌`}</Text>
      <ScrollView
        style={{
          height: windowSize === 'SMALL' ? 110 : 150,
          flexGrow: 0,
        }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
        horizontal
      >
        <AddCardPanel
          cards={cards}
          addCard={addCard}
          rank={rank}
          large={windowSize === 'BIG'}
        />
      </ScrollView>
      <ControlPanel
        numberOfCards={cards.length}
        clearCards={clearCards}
        randomCards={randomCards}
        deleteLastCard={deleteLastCard}
        rank={rank}
        incRank={incRank}
        decRank={decRank}
      />
    </View>
  )
}
