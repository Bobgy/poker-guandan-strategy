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
}

export type AppState = RankState & CardState

export interface NavigationProps {
  navigation: {
    navigate(page: string): void
  }
  screenProps: AppState
}
