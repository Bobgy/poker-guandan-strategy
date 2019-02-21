import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Button,
  ScrollView,
} from 'react-native'
import { NavigationProps, TCard } from './types'
import { CardsChooser } from './CardsChooser'
import { RankChooser } from './useCardState'
import {
  loadCppModule,
  PortedCppModule,
  StrategyResult,
} from './loadCppModule'
import { Divider } from './Divider'
import { commonStyles } from './styles';
import { cardsToString } from './cardUtils';
import { SolutionVisualization } from './SolutionVisualization';

let strategyModule: PortedCppModule | null = null

export type StrategyResultState = null | 'loading' | StrategyResult

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
  } = screenProps
  const [strategyResult, setResult] = useState<StrategyResultState>(null)
  const [isResultWindowMaxed, setResultWindowState] = useState<boolean>(false)
  const toggleResultWindowSize = useCallback(
    () => setResultWindowState(prevState => !prevState),
    [setResultWindowState],
  )

  return (
    <ScrollView
      style={[commonStyles.borderBox, { height: '100%' }]}
      contentContainerStyle={{
        height: '100%',
      }}
    >
      <SolutionVisualization
        strategyResult={strategyResult}
        rank={rank}
        isWindowMaxed={isResultWindowMaxed}
        toggleWindowSize={toggleResultWindowSize}
      />
      {!isResultWindowMaxed && (
        <>
          <Divider />
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
            style={[
              commonStyles.container,
              {
                flex: 1,
                minHeight: 350,
              },
            ]}
          >
            <CardsChooser
              cards={cards}
              addCard={addCard}
              clearCards={clearCards}
              randomCards={randomCards}
              deleteLastCard={deleteLastCard}
            />
          </View>
          <Divider />
          <View
            style={[
              commonStyles.container,
              {
                height: 34,
                justifyContent: 'center',
                padding: 0,
              },
            ]}
          >
            <Button
              title="计算策略"
              onPress={() => {
                setResult('loading')

                setTimeout(() => {
                  if (strategyModule != null) {
                    const cardsStr = cardsToString(cards)
                    console.log(cardsStr)
                    setResult(strategyModule.calc(cardsStr, rank))
                  }
                }, 0)
              }}
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}

Home.navigationOptions = {
  title: '掼蛋策略计算',
}
