/// <reference path="lib.d.ts"/>

import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'

function Home() {
  return <Text>Home</Text>
}

function Details(props: any) {
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

const AppNavigator = createBrowserApp(
  createSwitchNavigator(
    {
      Home,
      Details,
    },
    {
      initialRouteName: 'Details',
    },
  ),
)

function App() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
      }}
    >
      <AppNavigator />
    </View>
  )
}

export default App
