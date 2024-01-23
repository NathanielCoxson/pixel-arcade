export type MinesweeperScore = {
    id: string,
    uid: string,
    time: number,
    numMines: number,
    timestamp: Date,
}

export type SnakeScore = {
    id: string,
    uid: string,
    score: number,
    numRows: number,
    numCols: number,
    timestamp: Date,
}