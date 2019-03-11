import { ResultProps } from './useResultState'

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

export type AppState = RankState & CardState & ResultProps

export interface NavigationProps {
  navigation: {
    navigate(page: string): void
    goBack(): void
  }
  screenProps: AppState
}
