/// <reference path="lib.d.ts"/>

import React, { useState } from 'react'
import { View, Text, Button } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'
import { NavigationProps } from './types'
import { useCardState } from './useCardState'
import { Home } from './Home'
import { useResultState } from './useResultState'

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
  const resultProps = useResultState()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightblue',
        height: '100%',
      }}
    >
      <AppNavigator
        screenProps={{ rank, setRank, ...cardStateProps, ...resultProps }}
        {...props}
      />
    </View>
  )
}
App.router = AppNavigator.router

export default createBrowserApp(App)
