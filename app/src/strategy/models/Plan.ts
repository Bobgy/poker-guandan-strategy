import { Play } from './Play'

// A plan is the combination of plays for all your cards.
export type Plan = { plays: Play[]; score: number }
