import React, { useState, useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { NavigationProps, TCard } from './types'
import { CardsChooser } from './CardsChooser'
import { loadCppModule, PortedCppModule } from './loadCppModule'
import { Divider } from './Divider'
import { commonStyles } from './styles'
import { cardsToString } from './cardUtils'
import SolutionVisualization from './SolutionVisualization'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'

let strategyModule: PortedCppModule | null = null

export function Home({ screenProps }: NavigationProps) {
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

  const {
    rank,
    setRank,
    cards,
    clearCards,
    addCard,
    randomCards,
    deleteLastCard,
    strategyResult,
    setResult,
  } = screenProps
  const [isResultWindowMaxed, setResultWindowState] = useState<boolean>(false)
  const toggleResultWindowSize = useCallback(
    () => setResultWindowState(prevState => !prevState),
    [setResultWindowState],
  )
  const handleSolutionCalcButton = useCallback(() => {
    setResult('loading')
    setResultWindowState(true)

    setTimeout(() => {
      if (strategyModule != null) {
        // console.log(cards)
        const cardsStr = cardsToString(cards)
        // console.log(cardsStr)
        setResult(strategyModule.calc(cardsStr, rank))
      }
    }, 0)
  }, [cards, setResult, setResultWindowState])

  return (
    <View style={{ height: '100%' }}>
      <Text style={{ fontSize: 14 }}>掼蛋拆牌计算器</Text>
      {isResultWindowMaxed ? (
        <SolutionVisualization
          strategyResult={strategyResult}
          rank={rank}
          toggleWindowSize={toggleResultWindowSize}
        />
      ) : (
        <>
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
            <MyButton
              title="计算拆牌策略"
              onPress={handleSolutionCalcButton}
              style={{ height: 60 }}
              titleStyle={{ fontSize: 28 }}
            />
          </View>
        </>
      )}
    </View>
  )
}

Home.navigationOptions = {
  title: '掼蛋策略计算',
}
