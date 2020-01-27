import React, { useCallback, Fragment } from 'react'
import { View, Text } from 'react-native'
import { NavigationProps, AppState } from './types'
import { CardsChooser } from './CardsChooser'
import { Divider } from './Divider'
import { commonStyles } from './styles'
import { cardsToString } from './cardUtils'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'

interface StatelessHomePageProps
  extends Pick<
  AppState,
  | 'rank'
  | 'setRank'
  | 'cards'
  | 'clearCards'
  | 'addCard'
  | 'randomCards'
  | 'deleteLastCard'
  | 'strategyResult'
  | 'setResult'
  | 'strategyModule'
  | 'windowSize'
  >,
  Pick<NavigationProps, 'navigation'> { }
const HomePage: React.FunctionComponent<StatelessHomePageProps> = ({
  rank,
  setRank,
  cards,
  clearCards,
  addCard,
  randomCards,
  deleteLastCard,
  strategyResult,
  setResult,
  navigation,
  strategyModule,
  windowSize,
}) => {
  const handleSolutionCalcButton = useCallback(() => {
    if (strategyModule != null && strategyModule !== 'error') {
      setResult('loading')

      setTimeout(() => {
        // console.log(cards)
        const cardsStr = cardsToString(cards)
        // console.log(cardsStr)
        const result = strategyModule.calc(cardsStr, rank, true)

        // set a minimum extra delay to avoid UI flashing too quickly
        setTimeout(() => {
          navigation.navigate('Result')
          setResult(result)
        }, 300)
      }, 0)
    }
  }, [cards, setResult, navigation, strategyModule])

  if (strategyModule === 'error') {
    return <Text>{'strategy module failed to load'}</Text>
  }

  return (
    <Fragment>
      <View
        style={[
          commonStyles.container,
          {
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <RankChooser rank={rank} setRank={setRank} />
      </View>
      <Divider />
      <View
        style={{
          flex: 1,
        }}
      >
        <CardsChooser
          cards={cards}
          addCard={addCard}
          clearCards={clearCards}
          randomCards={randomCards}
          deleteLastCard={deleteLastCard}
          windowSize={windowSize}
        />
      </View>
      <View
        style={[
          commonStyles.container,
          {
            justifyContent: 'center',
            padding: 6,
          },
        ]}
      >
        {(() => {
          const isReady = strategyResult !== 'loading'
          return (
            <MyButton
              title={isReady ? '开始拆牌' : '拆牌中...'}
              disabled={!isReady}
              onPress={handleSolutionCalcButton}
              style={{
                height: 60,
              }}
              titleStyle={{
                fontSize: 28,
              }}
            />
          )
        })()}
      </View>
    </Fragment>
  )
}

const MemoedHomePage = React.memo(HomePage)

function HomePageWrapper({ screenProps, navigation }: NavigationProps) {
  return <MemoedHomePage {...screenProps} navigation={navigation} />
}

export default HomePageWrapper
