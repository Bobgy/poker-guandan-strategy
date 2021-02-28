import { Play, playToText } from './Play'

// A plan is the combination of plays for all your cards.
export type Plan = { plays: Play[]; score: number }

export function planToText(plan: Plan): string[] {
  return plan.plays.map(playToText)
}
