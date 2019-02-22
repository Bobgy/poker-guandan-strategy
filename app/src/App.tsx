/// <reference path="lib.d.ts"/>

import React, {
  useState,
  useCallback,
  FunctionComponent,
  useMemo,
  useEffect,
} from 'react'
import { View, Text, Animated, StyleProp, ViewStyle } from 'react-native'
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

interface FadeProps {
  style?: StyleProp<ViewStyle>
}
const Fade: FunctionComponent<FadeProps> = ({ children, style }) => {
  const [fadeAnim, _] = useState(new Animated.Value(0))
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

interface AppNavigatorProps {
  route: string
  navigate: (newRoute: string) => void
  screenProps: AppState
  style?: StyleProp<ViewStyle>
}
const AppNavigator: FunctionComponent<AppNavigatorProps> = ({
  route,
  navigate,
  screenProps,
  style,
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
    return (
      <Fade key={route} style={style}>
        <ChosenScreen screenProps={screenProps} navigation={navigation} />
      </Fade>
    )
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
          style={{
            flex: 1,
          }}
        />
      </View>
    </View>
  )
}

export default App
