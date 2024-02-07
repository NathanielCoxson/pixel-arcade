export enum State {
    Visible,
    Covered,
    Flagged,
    Unknown,
}

export type Cell = {
    value: number,
    state: State
}

const DIRECTIONS: [number, number][] = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

/**
 * Returns an array which contains the numbers
 * of the given array but shuffled.
 * @param {number[]} arr 
 * @returns {number[]}
 */
export function getShuffledArray(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * i);
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
}

/**
 * Returns a matrix of dimensions numRows X numCols
 * with numMines number of mines.
 * @param {number} numRows 
 * @param {number} numCols 
 * @param {number} numMines 
 * @returns {number[][]} the mine matrix
 */
export function getMineBoard(numRows: number, numCols: number, numMines: number): number[][] {
    const mineBoard = Array.from({ length: numRows }, () => Array(numCols).fill(0));
    const totalPixels = numRows * numCols;
    const positions = Array.from({ length: totalPixels }, (_, index) => index);
    const minePositions = getShuffledArray(positions).slice(0, numMines);

    for (let pos of minePositions) {
        const row = Math.floor(pos / numCols);
        const col = pos % numCols;
        mineBoard[row][col] = -1; 
    }

    return mineBoard;
}

/**
 * Returns the number of mines that are adjacent to board[row][col] 
 * @param {number} row 
 * @param {number} col 
 * @param {number[][]} board 
 * @returns {number} 
 */
export function calculateAdjacentMines(row: number, col: number, board: number[][]): number {
    const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    let count = 0;
    for (let dir of directions) {
        const newRow = row + dir[0];
        const newCol = col + dir[1];
        if (
            0 <= newRow && newRow < board.length &&
            0 <= newCol && newCol < board[newRow].length &&
            board[newRow][newCol] === -1
        ) count++;
    }
    return count;
}

/**
 * Returns a filled minesweeper board given the desired dimensions
 * and number of mines to place. 
 * @param {number} rows
 * @param {number} cols
 * @param {number} numMines
 * @returns {Cell[][]} 
 */
export function getFilledBoard(rows: number, cols: number, numMines: number): Cell[][] {
    const mineBoard = getMineBoard(rows, cols, numMines);
    const filledBoard: Cell[][] = Array.from({ length: rows }, () => Array(cols).fill({ value: 0, state: State.Covered }));

    for (let row = 0; row < mineBoard.length; row++) {
        for (let col = 0; col < mineBoard[row].length; col++) {
            if (mineBoard[row][col] === -1) {
                filledBoard[row][col] = { ...filledBoard[row][col], value: -1 };
                continue;
            }
            filledBoard[row][col] = { ...filledBoard[row][col], value: calculateAdjacentMines(row, col, mineBoard) }
        }
    }

    return filledBoard;
}

/**
 * Sets the state of all cells adjacent to the cell at
 * [row][col] to visible. 
 * @param {number} row 
 * @param {number} col 
 * @param {Cell[][]} board 
 */
export function clearAdjacentCells(row: number, col: number, board: Cell[][]) {
    for (const [dr, dc] of DIRECTIONS) {
        const newRow = row + dr, newCol = col + dc;
        if (
            newRow < 0 ||
            newRow >= board.length ||
            newCol < 0 ||
            newCol >= board[0].length
        ) continue; 

        board[newRow][newCol] = { ...board[newRow][newCol], state: State.Visible };
    }
}