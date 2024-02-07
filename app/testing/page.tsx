'use client';
import MinesweeperCell from "../components/MinesweeperCell"
import { useEffect, useState } from "react"
import { Cell, State } from "./utils";
import * as utils from './utils';

export default function Testing() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;

    const [board, setBoard] = useState<Cell[][]>(utils.getFilledBoard(ROWS, COLS, NUM_MINES));
    
    function clearCell(row: number, col: number) {
        console.log("Clearing:", row, col);
        const newBoard = [...board];
        newBoard[row][col] = { ...newBoard[row][col], state: State.Visible };
        setBoard(newBoard);
    }
    
    return (
        <main className="flex h-screen min-h-screen flex-col items-center px-24 py-12 gap-2">
            <div></div>
            <div className="grid grid-cols-equal-10 grid-rows-equal-10 min-w-game-width min-h-game-height">
                    {board.map((row: Cell[], i: number) => {
                        return row.map((value: Cell, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="relative max-h-full max-w-full flex flex-wrap cursor-pointer text-center justify-center content-center select-none"
                            >
                                <MinesweeperCell 
                                    value={board[i][j].value}
                                    clearCell={clearCell}
                                    state={board[i][j].state}
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