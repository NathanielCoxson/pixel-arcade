import * as utils from './utils';

const NUM_ROWS = 5;
const NUM_COLS = 5;
const NUM_MINES = 5;
const testBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, -1, -1, -1],
    [0, 0, -1, 0, 0, 0, 0, -1, 0, -1],
    [0, 0, -1, 0, 0, 0, 0, -1, -1, -1],
]

describe('getMineBoard', () => {
    it('returns a matrix with the correct dimensions', () => {
        const board = utils.getMineBoard(NUM_ROWS, NUM_COLS, NUM_MINES);
        expect(board.length).toBe(5);
        expect(board[0]).toBeDefined();
        expect(board[0].length).toBe(5);
    });
    it('places the correct number of mines', () => {
        const board = utils.getMineBoard(NUM_ROWS, NUM_COLS, NUM_MINES);
        let count = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === -1) count++;
            }
        }
        expect(count).toBe(NUM_MINES);
    });
});

describe('calculateAdjacentMines', () => {
    it('returns 0 when there are no adjacent mines', () => {
        const adjacentMines = utils.calculateAdjacentMines(1, 8, testBoard);
        expect(adjacentMines).toBe(0);
    });
    it('returns 8 when a position is surrounded by mines', () => {
        const adjacentMines = utils.calculateAdjacentMines(8, 8, testBoard);
        expect(adjacentMines).toBe(8);
    });
    it('works for edge positions', () => {
        const adjacentMines = utils.calculateAdjacentMines(0, 3, testBoard);
        expect(adjacentMines).toBe(1);
    });
});

describe('actions test', () => {
    it('should block merge on failure', () => {
        expect(false).toBe(true);
    });
    it('should block merge on failure', () => {
        expect(false).toBe(true);
    });
});
