import React, { Fragment, useCallback, useState } from 'react'
import { View } from 'react-native'
import { CardsChooser } from './CardsChooser'
import { AppState, NavigationProps } from './common/types'
import { Divider } from './Divider'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'
import { cardRawToText } from './strategy/models/Card'
import { calc } from './strategy/strategy'
import { commonStyles } from './styles'

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
      | 'windowSize'
    >,
    Pick<NavigationProps, 'navigation'> {}
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
  windowSize,
}) => {
  const [useValueEstimator, setUseValueEstimator] = useState(true)
  const handleSolutionCalcButton = useCallback(() => {
    setResult('loading')

    setTimeout(() => {
      // console.log(cards)
      const plans = calc({
        cards,
        mainRank: rank,
        morePlans: true,
        scorer: useValueEstimator ? 'HEURISTICS' : 'HANDS',
      })
      // set a minimum extra delay to avoid UI flashing too quickly
      setTimeout(() => {
        navigation.navigate('Result')
        setResult(plans)
      }, 300)
    }, 0)
  }, [cards, setResult, navigation, useValueEstimator])

  return (
    <Fragment>
      <View
        style={[
          commonStyles.container,
          {
            flexDirection: 'row',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <RankChooser rank={rank} setRank={setRank} />
        <MyButton
          title={useValueEstimator ? '价值' : '手数'}
          onPress={() => setUseValueEstimator((use) => !use)}
          titleStyle={{
            fontSize: 18,
          }}
        />
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
