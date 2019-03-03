/// <reference path="lib.d.ts"/>

import React, { useState, FunctionComponent, useMemo } from 'react'
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native'
import { AppState } from './types'
import { useCardState } from './useCardState'
import Home from './Home'
import ResultPage from './ResultPage'
import { useResultState } from './useResultState'
import { Fade } from './Fade'
import { TransitionGroup } from 'react-transition-group'

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

const routes = {
  Home,
  Result: ResultPage,
}
const AppNavigator: FunctionComponent<AppNavigatorProps> = ({
  route: currentRoute,
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
      <TransitionGroup>
        {Object.entries(routes).map(([route, RouteComponent]) => {
          if (route !== currentRoute) return null

          return (
            <Fade
              key={route}
              style={[styles.absoluteChild, style]}
              timeout={300}
            >
              <RouteComponent
                screenProps={screenProps}
                navigation={navigation}
              />
            </Fade>
          )
        })}
      </TransitionGroup>
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
