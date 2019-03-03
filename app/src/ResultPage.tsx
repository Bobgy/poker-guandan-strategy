import React, { useCallback } from 'react'
import { NavigationProps } from './types'
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
export default ResultPage
