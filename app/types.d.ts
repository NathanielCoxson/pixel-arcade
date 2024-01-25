export type MinesweeperScore = {
    id: string,
    uid: string,
    time: number,
    numMines: number,
    timestamp: Date,
    win: boolean,
}

export type SnakeScore = {
    id: string,
    uid: string,
    score: number,
    numRows: number,
    numCols: number,
    timestamp: Date,
}