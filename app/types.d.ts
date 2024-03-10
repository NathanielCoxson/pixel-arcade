export type MinesweeperScore = {
    id: string,
    uid: string,
    time: number,
    numMines: number,
    timestamp: Date,
    win: boolean,
    numCleared: number,
    numRows: number,
    numCols: number,
}

export type SnakeScore = {
    id: string,
    uid: string,
    score: number,
    numRows: number,
    numCols: number,
    timestamp: Date,
}

export type Response = {
    success: boolean,
    message: string,
    data: any
}

export type FriendRequest = {
    id: string,
    senderId: string,
    receiverId: string,
    senderUsername: string,
    receiverUsername: string,
}
