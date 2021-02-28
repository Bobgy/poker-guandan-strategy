import { CardRaw, NaturalRankWithoutJokers } from '../strategy/models/const'
import { ResultProps } from '../useResultState'
import { WindowSize } from '../useWindowSize'

export interface RankState {
  rank: NaturalRankWithoutJokers
  setRank: (rank: NaturalRankWithoutJokers) => void
}

export interface CardState {
  cards: CardRaw[]
  addCard(card: CardRaw): void
  clearCards(): void
  randomCards(): void
  deleteLastCard(): void
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
