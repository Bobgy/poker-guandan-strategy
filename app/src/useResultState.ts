import { useState } from 'react'
import { Plan } from './strategy/models/Plan'

export type StrategyResultState = null | 'loading' | Plan[]
export interface ResultProps {
  strategyResult: StrategyResultState
  setResult: (result: StrategyResultState) => void
}
export const useResultState = () => {
  const [strategyResult, setResult] = useState<StrategyResultState>(null)
  return {
    strategyResult,
    setResult,
  }
}
