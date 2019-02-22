/// <reference path="lib.d.ts"/>

import React, { useState, useCallback } from 'react'
import { View, Text } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { NavigationProps } from './types'
import { useCardState } from './useCardState'
import { Home } from './Home'
import { useResultState } from './useResultState'
import SolutionVisualization from './SolutionVisualization'

function ResultPage({ screenProps, navigation }: NavigationProps) {
  const { strategyResult, rank } = screenProps
  const closeResultPage = useCallback(() => {
    navigation.navigate('Home')
  }, [navigation])

  return (
    <SolutionVisualization
      strategyResult={strategyResult}
      rank={rank}
      onClose={closeResultPage}
    />
  )
}

const AppNavigator = createSwitchNavigator(
  {
    Home,
    Result: ResultPage,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      title: '掼蛋拆牌计算器',
    },
    paths: {
      Home: '',
      Result: 'result',
    },
  },
)

function App(props: any) {
  const [rank, setRank] = useState('2')
  const cardStateProps = useCardState()
  const resultProps = useResultState()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightblue',
        height: '100%',
      }}
    >
      <View style={{ height: '100%' }}>
        <Text style={{ fontSize: 14 }}>掼蛋拆牌计算器</Text>
        <AppNavigator
          screenProps={{ rank, setRank, ...cardStateProps, ...resultProps }}
          {...props}
        />
      </View>
    </View>
  )
}
App.router = AppNavigator.router

export default createBrowserApp(App)
