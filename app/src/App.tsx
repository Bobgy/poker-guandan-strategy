/// <reference path="lib.d.ts"/>

import React, { useState, useEffect } from 'react'
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  borderBox: {
    borderWidth: 2,
    borderColor: 'black',
  },
  divider: {
    height: 2,
    backgroundColor: 'black',
  },
})

function Divider() {
  return <View style={styles.divider} />
}

function Home({ screenProps, navigation }: NavigationProps) {
  const { rank, setRank, cards, clearCards, addCard } = screenProps
  const [strategyResult, setResult]: [
    null | StrategyResult,
    (result: StrategyResult) => void
  ] = useState(null) as any

  return (
    <ScrollView
      style={[styles.borderBox, { height: '100%' }]}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View
        style={[
          styles.container,
          {
            height: 54,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <RankChooser rank={rank} setRank={setRank} />
      </View>
      <Divider />
      <ScrollView
        style={[
          styles.container,
          {
            flex: 2,
            // minHeight: 300,
          },
        ]}
      >
        <CardsChooser cards={cards} addCard={addCard} clearCards={clearCards} />
      </ScrollView>
      <Divider />
      <View
        style={[
          styles.container,
          {
            height: 60,
            justifyContent: 'center',
          },
        ]}
      >
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
      </View>
      <Divider />
      <ScrollView
        style={[
          styles.container,
          {
            flex: 1,
            // minHeight: 200,
          },
        ]}
      >
        {strategyResult && (
          <>
            <Text>{`最少${strategyResult.minHands}手可以出完`}</Text>
            <Text>{strategyResult.solutions.join('\n')}</Text>
          </>
        )}
      </ScrollView>
    </ScrollView>
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
        backgroundColor: 'lightblue',
        height: '100%',
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
