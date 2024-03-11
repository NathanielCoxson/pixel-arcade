import * as utils from './utils';

const NUM_ROWS = 5;
const NUM_COLS = 5;
const NUM_MINES = 5;
const testBoard = [
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0, -1,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [ 0,  0, -1,  0,  0,  0,  0, -1, -1, -1],
    [ 0,  0, -1,  0,  0,  0,  0, -1,  0, -1],
    [ 0,  0, -1,  0,  0,  0,  0, -1, -1, -1],
];

const DIRECTIONS: [number, number][] = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

describe('getEmptyBoard()', () => {
    it('should have the correct dimensions and only contain zeroes', () => {
        const board = utils.getEmptyBoard(5, 5);

        expect(board.length).toBe(5);
        expect(board[0].length).toBe(5);
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                expect(board[r][c]).toBe(0);
            }
        }
    });
});

describe('getMineBoard()', () => {
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

describe('calculateAdjacentMines()', () => {
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

describe('getFilledBoard()', () => {
    const rows     = 10;
    const cols     = 10;
    const numMines = 10;
    const board    = utils.getFilledBoard(rows, cols, numMines);

    it('has the correct dimensions', () => {
        expect(board.length).toBe(rows);
        expect(board[0].length).toBe(cols);
    });
    it('has the correct number of mines', () => {
        let mineCount = 0;
        for (let r = 0; r < board.length; r++ ) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c].value === -1) mineCount++;
            }
        }
        expect(mineCount).toBe(numMines);
    });
    it('has the correct values and initial states', () => {
        for (let r = 0; r < board.length; r++ ) {
            for (let c = 0; c < board[r].length; c++) {
                // Correct initial state
                expect(board[r][c].state).toBe(utils.State.Covered);

                // Correct initial values for non-mine cells
                if (board[r][c].value === -1) continue;
                let count = 0;
                for (const [dr, dc] of DIRECTIONS) {
                    if (0 <= r + dr && r + dr < board.length    &&
                        0 <= c + dc && c + dc < board[r].length &&
                        board[r+dr][c+dc].value === -1) {
                        count += 1; 
                    }
                }
                expect(count).toBe(board[r][c].value);
            }
        }
    });
});
