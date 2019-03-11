import React from 'react'
import { NavigationProps } from './types'
import SolutionVisualization from './SolutionVisualization'

function ResultPage({ screenProps, navigation }: NavigationProps) {
  const { strategyResult, rank } = screenProps

  return (
    <SolutionVisualization
      strategyResult={strategyResult}
      rank={rank}
      onClose={navigation.goBack}
    />
  )
}
export default ResultPage
