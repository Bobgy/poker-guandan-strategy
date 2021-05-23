import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { NavigationProps } from './common/types'
import SolutionVisualization from './SolutionVisualization'
import { calc } from './strategy/strategy'
import { StrategyResult } from './useResultState'

function ResultPage({ screenProps, navigation }: NavigationProps) {
  const { rank, cards, windowSize } = screenProps
  const args1 = {
    cards,
    mainRank: rank,
    morePlans: true,
    scorer: 'HEURISTICS' as const,
  }
  const [transitioned, setTransitioned] = useState(false)
  useEffect(() => {
    const handle = setTimeout(() => {
      setTransitioned(true)
    }, 500)
    return () => {
      clearTimeout(handle)
    }
  }, [])
  const { status: status1, data: plans1 } = useQuery(
    ['calc', args1],
    async () => calc(args1),
    { enabled: transitioned },
  )
  const args2 = {
    cards,
    mainRank: rank,
    morePlans: true,
    scorer: 'HANDS' as const,
  }
  const { status: status2, data: plans2 } = useQuery(
    ['calc', args2],
    async () => calc(args2),
    { enabled: status1 == 'success' },
  )
  let strategyResult: StrategyResult[] = ['loading']
  // TODO: handle error?
  if (status1 == 'success') {
    strategyResult = [{ title: '价值策略', plans: plans1! }]
    if (status2 == 'loading') {
      strategyResult.push('loading' as const)
    } else if (status2 == 'success') {
      strategyResult.push({ title: '手数策略', plans: plans2! })
    }
  }

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
