import React, {
  useState,
  useCallback,
  FunctionComponent,
  ReactNode,
} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ScrollView,
} from 'react-native'
import { RANKS, SUITS, SUITS_JOKER } from './constants'
import { CardState } from './types'
import { Divider } from './Divider'
import { CardDeck, Card } from './Card'

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

interface MyButtonProps extends TouchableOpacityProps {
  title: ReactNode
  titleStyle?: StyleProp<TextStyle>
}

const MyButton: FunctionComponent<MyButtonProps> = ({
  style,
  titleStyle,
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
        alignItems: 'center',
        justifyContent: 'center',
      },
      style,
    ]}
    disabled={disabled}
    {...restProps}
  >
    <Text
      style={[
        {
          color: disabled ? theme.disabled.text : 'white',
        },
        titleStyle,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
)

const controlStyles = StyleSheet.create({
  incDecButton: {
    flex: 2,
    minWidth: 100,
    maxWidth: 200,
    margin: 10,
  },
  clearButton: {
    flex: 1,
    minWidth: 100,
    maxWidth: 150,
    margin: 10,
  },
  buttonTitle: {
    fontSize: 30,
  },
})
interface ControlPanelProps {
  decRank: () => void
  incRank: () => void
  clearCards: () => void
  rankID: number
  numberOfCards: number
}
const ControlPanel: React.FunctionComponent<ControlPanelProps> = props => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
    }}
  >
    <MyButton
      onPress={props.clearCards}
      title="清除"
      disabled={props.numberOfCards === 0}
      style={controlStyles.clearButton}
      titleStyle={controlStyles.buttonTitle}
    />
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
)

export function CardsChooser({ cards, addCard, clearCards }: CardState) {
  const {
    value: rankID,
    increase: incRank,
    decrease: decRank,
  } = useIncDecState()

  return (
    <View style={{ flex: 1 }}>
      <CardDeck cards={cards} />
      <Divider />
      <ScrollView
        style={{ height: 110, flexGrow: 0 }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}
        horizontal
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
      </ScrollView>
      <ControlPanel
        numberOfCards={cards.length}
        clearCards={clearCards}
        rankID={rankID}
        incRank={incRank}
        decRank={decRank}
      />
    </View>
  )
}

export const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 60 * 1.618,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    margin: 3,
  },
  cardStacked: {
    marginRight: -60,
    marginBottom: -60,
  },
})
