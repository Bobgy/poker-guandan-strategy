/// <reference path="lib.d.ts"/>

import React, { useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { NavigationProps, TCard } from './types'
import { CardsChooser } from './CardsChooser'
import { RankChooser, useCardState } from './useCardState'
import { loadCppModule, PortedCppModule, StrategyResult } from './loadCppModule'

let strategyModule: PortedCppModule | null = null

function cardsToString(cards: TCard[]) {
  return cards
    .map(card => {
      if (card.rank === 'X') {
        // big joker and small joker
        return card.suit === 'R' ? 'BJ' : 'SJ'
      }
      return card.rank + card.suit
    })
    .join('')
}

function Home({ screenProps, navigation }: NavigationProps) {
  const { rank, setRank, cards, clearCards, addCard } = screenProps
  const [strategyResult, setResult]: [
    null | StrategyResult,
    (result: StrategyResult) => void
  ] = useState(null) as any

  return (
    <View>
      <RankChooser rank={rank} setRank={setRank} />
      <CardsChooser cards={cards} addCard={addCard} clearCards={clearCards} />
      <Button
        title="计算策略"
        onPress={() => {
          if (strategyModule != null) {
            const cardsStr = cardsToString(cards)
            console.log(cardsStr)

            setResult(strategyModule.calc(cardsStr, rank))
          }
        }}
      />
      {strategyResult && (
        <View>
          <Text>{`最少${strategyResult.minHands}手可以出完`}</Text>
          <Text>{strategyResult.solutions.join('\n')}</Text>
        </View>
      )}
    </View>
  )
}
Home.navigationOptions = {
  title: '掼蛋策略计算',
}

function Details(props: NavigationProps) {
  return (
    <View>
      <Text>Details</Text>
      <Button
        title="Go to Home"
        onPress={() => props.navigation.navigate('Home')}
      />
    </View>
  )
}

const AppNavigator = createSwitchNavigator(
  {
    Home,
    Details,
  },
  {
    initialRouteName: 'Home',
  },
)

function App(props: any) {
  const [rank, setRank] = useState('2')
  const cardStateProps = useCardState()
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
      }}
    >
      <AppNavigator
        screenProps={{ rank, setRank, ...cardStateProps }}
        {...props}
      />
    </View>
  )
}
App.router = AppNavigator.router

export default createBrowserApp(App)
