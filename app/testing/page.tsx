'use client';
import MinesweeperCell from "../components/MinesweeperCell"
import { useState } from "react"

export default function Testing() {
    const [board, setBoard] = useState<number[][]>(Array.from({ length: 10 }, () => Array(10).fill(0)));
    function updateBoard(row: number, col: number) {
        console.log('cell clicked:', row, col);
        console.log(board);
        const newBoard = [...board];
        newBoard[0][0] = 1;
        setBoard(newBoard);
    }
    return (
        <main className="flex h-screen min-h-screen flex-col items-center px-24 py-12 gap-2">
            <div></div>
            <div className="grid grid-cols-equal-10 grid-rows-equal-10 min-w-game-width min-h-game-height">
                    {board.map((row: number[], i: number) => {
                        return row.map((value: number, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="relative max-h-full max-w-full flex flex-wrap cursor-pointer text-center justify-center content-center select-none"
                            >
                                <MinesweeperCell value={1} visible={board[i][j]} updateBoard={updateBoard} row={i} col={j}/>
                            </div>
                        })
                    })}
                </div>
        </main>
    )
}