import { useState } from 'react'
import { Plan } from './strategy/models/Plan'

export type StrategyResult = null | 'loading' | { title: string; plans: Plan[] }
export interface ResultProps {
  strategyResult: StrategyResult[]
  setResult: (result: StrategyResult[]) => void
}
export const useResultState = () => {
  const [strategyResult, setResult] = useState<StrategyResult[]>([])
  return {
    strategyResult,
    setResult,
  }
}
