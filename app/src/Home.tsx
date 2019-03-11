import React, { useEffect, useCallback, Fragment } from 'react'
import { View } from 'react-native'
import { NavigationProps, AppState } from './types'
import { CardsChooser } from './CardsChooser'
import { loadCppModule, PortedCppModule } from './loadCppModule'
import { Divider } from './Divider'
import { commonStyles } from './styles'
import { cardsToString } from './cardUtils'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'

let strategyModule: PortedCppModule | null = null

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
}) => {
  useEffect(() => {
    loadCppModule().then(cppModule => {
      strategyModule = cppModule
      // uncomment the following to test the module
      // console.log(
      //   strategyModule.calc(
      //     'BJADKDJH0S0C0CAH8D7S7H4H4D4H3D3C2H9C7CAH6C5CKSQSJS0S9S',
      //     'A',
      //   ),
      // )
    })
  }, [])

  const handleSolutionCalcButton = useCallback(() => {
    setResult('loading')

    setTimeout(() => {
      if (strategyModule != null) {
        // console.log(cards)
        const cardsStr = cardsToString(cards)
        // console.log(cardsStr)
        const result = strategyModule.calc(cardsStr, rank)

        // set a minimum extra delay to avoid UI flashing too quickly
        setTimeout(() => {
          navigation.navigate('Result')
          setResult(result)
        }, 300)
      } else {
        throw new Error('strategy module is null')
      }
    }, 0)
  }, [cards, setResult, navigation])

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
