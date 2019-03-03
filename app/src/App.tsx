/// <reference path="lib.d.ts"/>

import React, { useState, useCallback, FunctionComponent, useMemo } from 'react'
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native'
import { NavigationProps, AppState } from './types'
import { useCardState } from './useCardState'
import { Home } from './Home'
import { useResultState } from './useResultState'
import SolutionVisualization from './SolutionVisualization'
import { Fade } from './Fade'

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
  style?: StyleProp<ViewStyle>
}
const styles = StyleSheet.create({
  absoluteChild: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
})
const AppNavigator: FunctionComponent<AppNavigatorProps> = ({
  route,
  navigate,
  screenProps,
  style,
}) => {
  const navigation = useMemo(
    () => ({
      navigate,
    }),
    [navigate],
  )

  return (
    <>
      <Fade
        key="Home"
        style={[styles.absoluteChild, style]}
        in={route === 'Home'}
        timeout={300}
      >
        <Home screenProps={screenProps} navigation={navigation} />
      </Fade>
      <Fade
        key="Result"
        style={[styles.absoluteChild, style]}
        in={route === 'Result'}
        timeout={300}
      >
        <ResultPage screenProps={screenProps} navigation={navigation} />
      </Fade>
    </>
  )
}

function App() {
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
        <View style={{ flex: 1 }}>
          <AppNavigator
            route={route}
            screenProps={{ rank, setRank, ...cardStateProps, ...resultProps }}
            navigate={navigate}
            style={{
              flex: 1,
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default App
