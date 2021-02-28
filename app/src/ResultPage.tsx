import React from 'react'
import { NavigationProps } from './common/types'
import SolutionVisualization from './SolutionVisualization'

function ResultPage({ screenProps, navigation }: NavigationProps) {
  const { strategyResult, rank, windowSize } = screenProps

  return (
    <SolutionVisualization
      strategyResult={strategyResult}
      rank={rank}
      windowSize={windowSize}
      onClose={navigation.goBack}
    />
  )
}
export default ResultPage
