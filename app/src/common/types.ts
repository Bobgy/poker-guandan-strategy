import { PortedCppModule } from '../loadCppModule'
import { ResultProps } from '../useResultState'
import { WindowSize } from '../useWindowSize'

export interface RankState {
  rank: string
  setRank: (rank: string) => void
}

export interface TCard {
  rank: string
  suit: string
}

export interface CardState {
  cards: TCard[]
  addCard(card: TCard): void
  clearCards(): void
  randomCards(): void
  deleteLastCard(): void
}

export interface CppModuleState {
  strategyModule: null | 'error' | PortedCppModule
}

export type AppState = RankState &
  CardState &
  ResultProps & { windowSize: WindowSize }

export interface NavigationProps {
  navigation: {
    navigate(page: string): void
    goBack(): void
  }
  screenProps: AppState
}
