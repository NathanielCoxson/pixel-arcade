'use client';
import MinesweeperCell from "../components/MinesweeperCell"
import { useState } from "react"
import { Cell, State } from "./utils";
import * as utils from './utils';

export default function Testing() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;

    const [board, setBoard] = useState<Cell[][]>(utils.getFilledBoard(ROWS, COLS, NUM_MINES));
    
    function clearCell(row: number, col: number, clearAdjacent: boolean) {
        console.log("Clearing:", row, col);
        const newBoard = [...board];

        const numFlags = utils.calcualteAdjacentFlags(row, col, board);
        const safeToClear = (board[row][col].value - numFlags) <= 0;
        if (clearAdjacent && safeToClear) {
            utils.clearAdjacentCells(row, col, newBoard);
        }
        else {
            newBoard[row][col] = { ...newBoard[row][col], state: State.Visible };
        }

        setBoard(newBoard);
    }

    function flagCell(row: number, col: number) {
        console.log("Flagged:", row, col);
        const newBoard = [...board];
        const currentState = newBoard[row][col].state;
        const state = currentState === State.Flagged ? State.Covered : State.Flagged;
        newBoard[row][col] = { ...newBoard[row][col], state };
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
                                    flagCell={flagCell}
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