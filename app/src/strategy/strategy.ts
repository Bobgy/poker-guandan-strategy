import { Suit, SuitRedJoker, SuitBlackJoker } from "../common/cardUtils";

export type J = 11;
export const J = 11;
export type Q = 12;
export const Q = 12;
export type K = 13;
export const K = 13;
export type A = 1;
export const A = 1;
export type BlackJoker = 15;
export const BLACK_JOKER = 15;
export type RedJoker = 16;
export const RED_JOKER = 16;
export type NaturalRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | J | Q | K | BlackJoker | RedJoker;
export type NaturalRankWithoutJokers = Exclude<NaturalRank, BlackJoker | RedJoker>;
/**
 * There are 14 different cards. In one game play, they will have a power
 * rank depending on main rank.
 */
export type PowerRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type Card = {
    // Natural rank, from [A, K] maps to [1, 13]
    // 14 is kept for A's order rank.
    // Black Joker is 15, Red Joker is 16
    rank: NaturalRankWithoutJokers,
    suite: Suit,
} | {
    rank: BlackJoker,
    suite: SuitBlackJoker,
} | {
    rank: RedJoker,
    suite: SuitRedJoker,
}

function getUsualPowerRank(rank: NaturalRank): PowerRank {
    switch (rank) {
        case RED_JOKER:
            return 14;
        case BLACK_JOKER:
            return 13;
        case A:
            return 12;
        default:
            return (rank - 2) as PowerRank;
    }
}

export class GameContext {
    constructor(mainRank: NaturalRankWithoutJokers) {
        this.mainRank = mainRank;
    }

    /** Which rank is largest in current game play. */
    readonly mainRank: NaturalRankWithoutJokers;

    /**
     * Returns range[0, 14], power of the rank in this gameplay.
     * The weakest is 0. The strongest (red joker) is 14.
     */
    getOrder(rank: NaturalRank): PowerRank {
        if (rank == RED_JOKER) {
            return 14;
        } else if (rank == BLACK_JOKER) {
            return 13;
        } else if (rank == this.mainRank) {
            return 12;
        } else {
            const usualRank = getUsualPowerRank(rank);
            const mainRankUsualPowerRank = getUsualPowerRank(this.mainRank);
            if (usualRank > mainRankUsualPowerRank) {
                return (rank - 3) as PowerRank;  // 10 becomes 7, ...
            } else {
                return (rank - 2) as PowerRank;  // 2 becomes 0, 3 becomes 1, ...
            }
        }
    }
};

export function calc(cards: Card[]) {
    return null;
}
