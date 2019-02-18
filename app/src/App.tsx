/// <reference path="lib.d.ts"/>

import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { NavigationProps } from './types'
import { CardsChooser } from './CardsChooser'
import { RankChooser, useCardState } from './useCardState'

function Home({ screenProps, navigation }: NavigationProps) {
  const { rank, setRank, cards, clearCards, addCard } = screenProps

  return (
    <View>
      <RankChooser rank={rank} setRank={setRank} />
      <CardsChooser cards={cards} addCard={addCard} clearCards={clearCards} />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
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
