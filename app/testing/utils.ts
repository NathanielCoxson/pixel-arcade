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