import * as utils from './utils';

describe('getMineBoard', () => {
    it('returns a matrix with the correct dimensions', () => {
        const board = utils.getMineBoard(5, 5, 5);
        expect(board.length).toBe(5);
        expect(board[0]).toBeDefined();
        expect(board[0].length).toBe(5);
    });
});