import './strategy'
import { calc, GameContext, A } from './strategy';

describe('Strategy Module', () => {
    it("doesn't crash when 0 cards provided", () => {
        expect(calc([])).toBe(null);
    })

    describe('GameContext', () => {
        it('keeps a mainRank', () => {
            const context = new GameContext(A);
            expect(context.mainRank).toEqual(A);
        })
    });
});
