/// <reference path="lib.d.ts"/>

import React, { useState, FunctionComponent, useEffect } from 'react'
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native'
import { NavigationProps } from './types'
import { useCardState } from './useCardState'
import Home from './Home'
import ResultPage from './ResultPage'
import { useResultState } from './useResultState'
import { Fade } from './Fade'
import { TransitionGroup } from 'react-transition-group'
import { createBrowserRouterHook } from './useRouterState'
import createHistory from 'history/createBrowserHistory'
import { PortedCppModule, loadCppModule } from './loadCppModule'

interface AppNavigatorProps extends NavigationProps {
  route: string
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
  navigation,
  screenProps,
  style,
}) => {
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

const routesConfig = {
  base: process.env.REACT_APP_BASE_URL || '',
  defaultRoute: 'Home',
  routes: {
    Home: {
      path: '',
      title: '掼蛋拆牌计算器',
    },
    Result: {
      path: '/result',
      title: '掼蛋拆牌计算器',
    },
  },
}
const history = createHistory()

const useRouterState = createBrowserRouterHook(routesConfig, history)

let strategyModule: PortedCppModule | null = null
function App() {
  const [rank, setRank] = useState('2')
  const cardStateProps = useCardState()
  const resultProps = useResultState()
  const { route, navigation } = useRouterState()
  useEffect(() => {
    loadCppModule()
      .then(cppModule => {
        strategyModule = cppModule
        // uncomment the following to test the module
        // console.log(
        //   strategyModule.calc(
        //     'BJADKDJH0S0C0CAH8D7S7H4H4D4H3D3C2H9C7CAH6C5CKSQSJS0S9S',
        //     'A',
        //   ),
        // )
      })
      .catch()
  }, [])

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
            navigation={navigation}
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
