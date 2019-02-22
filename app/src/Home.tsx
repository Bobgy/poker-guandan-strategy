import React, { useState, useEffect, useCallback } from 'react'
import { View, Text } from 'react-native'
import { NavigationProps, TCard } from './types'
import { CardsChooser } from './CardsChooser'
import { loadCppModule, PortedCppModule } from './loadCppModule'
import { Divider } from './Divider'
import { commonStyles } from './styles'
import { cardsToString } from './cardUtils'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'

let strategyModule: PortedCppModule | null = null

export function Home({ screenProps, navigation }: NavigationProps) {
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
          setResult(result)
          navigation.navigate('Result')
        }, 300)
      }
    }, 0)
  }, [cards, setResult, navigation])

  return (
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
        {(() => {
          const isReady = strategyResult !== 'loading'
          return (
            <MyButton
              title={isReady ? '开始拆牌' : '拆牌中...'}
              disabled={!isReady}
              onPress={handleSolutionCalcButton}
              style={{ height: 60 }}
              titleStyle={{ fontSize: 28 }}
            />
          )
        })()}
      </View>
    </>
  )
}
