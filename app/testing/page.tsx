'use client';
import MinesweeperCell from "../components/MinesweeperCell"
import { useEffect, useState } from "react"

export default function Testing() {
    const [board, setBoard] = useState<number[][]>(Array.from({ length: 10 }, () => Array(10).fill(0)));
    const [visibleCells, setVisibleCells] = useState<boolean[][]>(Array.from({ length: 10 }, () => Array(10).fill(false)));

    useEffect(() => {
        setBoard([
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, -1, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ])
    }, []);
    
    function updateBoard(row: number, col: number) {
        const newVisibleCells = [...visibleCells];

        newVisibleCells[row][col] = true;

        setVisibleCells(newVisibleCells);
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
                                <MinesweeperCell 
                                    value={board[i][j]}
                                    visible={visibleCells[i][j]}
                                    updateBoard={updateBoard}
                                    row={i}
                                    col={j}
                                />
                            </div>
                        })
                    })}
                </div>
        </main>
    )
}