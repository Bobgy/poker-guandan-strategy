/// <reference path="lib.d.ts"/>

import React, { useState } from 'react'
import { View, Text, Button, Picker } from 'react-native'
import { createSwitchNavigator } from '@react-navigation/core'
import { createBrowserApp } from '@react-navigation/web'

const RANKS = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  {
    value: '0',
    label: '10',
  },
  'J',
  'Q',
  'K',
  'A',
  {
    value: 'B',
    label: 'Black Joker',
    isJoker: true,
  },
  {
    value: 'R',
    label: 'Red Joker',
    isJoker: true,
  },
].map(data => {
  if (typeof data === 'object') {
    return data
  } else {
    const rank = data

    return {
      label: rank,
      value: rank,
    }
  }
})

interface RankState {
  rank: string
  setRank: (rank: string) => void
}

interface AppState extends RankState {}

interface NavigationProps {
  navigation: {
    navigate(page: string): void
  }
}

function RankChooser({ rank, setRank }: RankState) {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <Text style={{ fontSize: 22, marginHorizontal: 6 }}>当前打</Text>
      <Picker selectedValue={rank} onValueChange={setRank}>
        {RANKS.filter(rankOption => !rankOption.isJoker).map(rankOption => (
          <Picker.Item
            key={rankOption.value}
            label={rankOption.label}
            value={rankOption.value}
          />
        ))}
      </Picker>
    </View>
  )
}

function Cards() {
  return <Text>Cards</Text>
}

function Home(props: NavigationProps & AppState) {
  return (
    <View>
      <RankChooser rank={props.rank} setRank={props.setRank} />
      <Cards />
      <Button
        title="Go to Details"
        onPress={() => props.navigation.navigate('Details')}
      />
    </View>
  )
}

function Details(props: NavigationProps & AppState) {
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
      initialRouteName: 'Home',
    },
  ),
)

function App() {
  const [rank, setRank] = useState('2')

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
      }}
    >
      <AppNavigator rank={rank} setRank={setRank} />
    </View>
  )
}

export default App
