/// <reference path="lib.d.ts"/>

import React, { useState, useCallback, FunctionComponent, useMemo } from 'react'
import { View, Text } from 'react-native'
import { NavigationProps, AppState } from './types'
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

interface AppNavigatorProps {
  route: string
  navigate: (newRoute: string) => void
  screenProps: AppState
}

const AppNavigator: FunctionComponent<AppNavigatorProps> = ({
  route,
  navigate,
  screenProps,
}) => {
  let ChosenScreen = null
  if (route === 'Home') {
    ChosenScreen = Home
  } else if (route === 'Result') {
    ChosenScreen = ResultPage
  }
  const navigation = useMemo(
    () => ({
      navigate,
    }),
    [navigate],
  )

  if (ChosenScreen) {
    return <ChosenScreen screenProps={screenProps} navigation={navigation} />
  } else {
    return <Text>ERROR: Route not found!</Text>
  }
}

function App(props: any) {
  const [rank, setRank] = useState('2')
  const cardStateProps = useCardState()
  const resultProps = useResultState()
  const [route, navigate] = useState('Home')

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
          route={route}
          screenProps={{ rank, setRank, ...cardStateProps, ...resultProps }}
          navigate={navigate}
        />
      </View>
    </View>
  )
}

export default App
