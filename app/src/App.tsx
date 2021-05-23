/// <reference path="lib.d.ts"/>

import createHistory from 'history/createBrowserHistory'
import React, { FunctionComponent, useState } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TransitionGroup } from 'react-transition-group'
import { NavigationProps } from './common/types'
import { Fade } from './Fade'
import Home from './Home'
import ResultPage from './ResultPage'
import { A, NaturalRankWithoutJokers } from './strategy/models/const'
import { useCardState } from './useCardState'
import { useResultState } from './useResultState'
import { createBrowserRouterHook } from './useRouterState'
import { useWindowSize } from './useWindowSize'
import { QueryClient, QueryClientProvider } from 'react-query'

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

function App() {
  const [rank, setRank] = useState<NaturalRankWithoutJokers>(A)
  const cardStateProps = useCardState()
  const resultProps = useResultState()
  const { route, navigation } = useRouterState()
  const windowSize = useWindowSize()

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
            screenProps={{
              rank,
              setRank,
              ...cardStateProps,
              ...resultProps,
              windowSize,
            }}
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

// Create a client
const queryClient = new QueryClient()
const EnhancedApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)

export default EnhancedApp
