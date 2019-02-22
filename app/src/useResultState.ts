import { useState } from 'react'
import { StrategyResult } from './loadCppModule'

export type StrategyResultState = null | 'loading' | StrategyResult
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
