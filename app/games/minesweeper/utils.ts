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

export function getEmptyBoard(rows: number, cols: number) {
    return Array.from({ length: cols }, () => Array(rows).fill(0));
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
    const mineBoard = getEmptyBoard(numRows, numCols);

    const totalPixels = numRows * numCols;
    const positions = Array.from({ length: totalPixels }, (_, index) => index);
    const minePositions = getShuffledArray(positions).slice(0, numMines);

    for (let pos of minePositions) {
        const r = Math.floor(pos / numCols);
        const c = pos % numCols;
        mineBoard[r][c] = -1; 
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
 * Returns a filled minesweeper board given the desired dimensions
 * and number of mines to place and guarantees that position [row, col] 
 * will not be a mine. 
 * @param {Cell[][]} board
 * @param {number} row
 * @param {number} col
 * @param {number} rows
 * @param {number} cols
 * @param {number} numMines
 * @returns {Cell[][]} 
 */
export function getSafeBoard(board: Cell[][], row: number, col: number, rows: number, cols: number, numMines: number): Cell[][] {
    const mineBoard = getEmptyBoard(rows, cols);
    for (let i = 0; i < mineBoard.length; i++) {
        for (let j = 0; j < mineBoard[i].length; j++) {
            if (board[i][j].value === -1) mineBoard[i][j] = -1;
        }
    }

    if (mineBoard[row][col] === -1) {
        let minePlaced = false;
        for (let i = 0; i < mineBoard.length; i++) {
            for (let j = 0; j < mineBoard[i].length; j++) {
                if (mineBoard[i][j] != -1 && !minePlaced) {
                    mineBoard[i][j] = -1;
                    minePlaced = true;
                }
            }
        }
        mineBoard[row][col] = 0;
    }

    const filledBoard: Cell[][] = Array.from({ length: rows }, () => Array(cols).fill({ value: 0, state: State.Covered }));

    for (let i = 0; i < mineBoard.length; i++) {
        for (let j = 0; j < mineBoard[i].length; j++) {
            if (mineBoard[i][j] === -1) {
                filledBoard[i][j] = { ...filledBoard[i][j], value: -1 };
                continue;
            }
            filledBoard[i][j] = { ...filledBoard[i][j], value: calculateAdjacentMines(i, j, mineBoard) }
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
 * @returns { numCleared: number, success: boolean } 
 */
export function clearFromCell(row: number, col: number, board: Cell[][]): { numCleared: number, success: boolean } {
    let q: [number, number][] = [];
    let success = true;
    let numCleared = board[row][col].state === State.Visible ? 0 : 1;
    let numMines = 0;

    // Show starting cell
    board[row][col] = { ...board[row][col], state: State.Visible };
    // Check starting cell
    if (board[row][col].value === -1) return { numCleared, success: false };

    // Return early if adjacent clearing isn't safe
    const numFlags = calcualteAdjacentFlags(row, col, board);
    const safeToClear = (board[row][col].value - numFlags) <= 0;
    if (!safeToClear) return { numCleared, success: true };

    q.push([row, col]);
    while (q.length > 0) {
        const [r, c] = q[0];
        q = q.slice(1);

        // Check surrounding cells
        for (const [dr, dc] of DIRECTIONS) {
            const newRow = r + dr, newCol = c + dc;
            if (
                newRow < 0 ||
                newRow >= board.length ||
                newCol < 0 ||
                newCol >= board[0].length
            ) continue;

            const flagged = board[newRow][newCol].state === State.Flagged;
            const visible = board[newRow][newCol].state === State.Visible;
            if (flagged || visible) continue;

            if (board[newRow][newCol].value === -1) {
                success = false; 
                numMines++;
            }

            board[newRow][newCol] = { ...board[newRow][newCol], state: State.Visible };
            numCleared++;

            // Expand search on empty cells only
            if (board[newRow][newCol].value === 0) q.push([newRow, newCol]);
        }

    }
    return { numCleared: numCleared - numMines, success };
}

/**
 * Returns the number of adjacent cells that are flagged.
 * @param {number} row 
 * @param {number} col 
 * @param {Cell[][]} board 
 */
export function calcualteAdjacentFlags(row: number, col: number, board: Cell[][]): number {
    let count = 0;
    for (const [dr, dc] of DIRECTIONS) {
        const newRow = row + dr, newCol = col + dc;
        if (
            newRow < 0 ||
            newRow >= board.length ||
            newCol < 0 ||
            newCol >= board[0].length
        ) continue; 
        
        const flagged = board[newRow][newCol].state === State.Flagged;
        if (flagged) count++;
    }
    return count;
}
