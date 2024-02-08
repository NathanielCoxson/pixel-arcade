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
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [gameLost, setGameLost] = useState<boolean>(false);
    
    function clearCell(row: number, col: number, clearAdjacent: boolean) {
        console.log("Clearing:", row, col);
        const newBoard = [...board];

        const numFlags = utils.calcualteAdjacentFlags(row, col, board);
        const safeToClear = (board[row][col].value - numFlags) <= 0;
        if (clearAdjacent && safeToClear) {
            utils.clearAdjacentCells(row, col, newBoard);
        }
        newBoard[row][col] = { ...newBoard[row][col], state: State.Visible };

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

    function playGame() {
        setGameOver(false);
        setGameWon(false);
        setGameLost(false);

        const emptyBoard = [...board];
        for (let row = 0; row < emptyBoard.length; row++) {
            for (let col = 0; col < emptyBoard[row].length; col++) {
                emptyBoard[row][col] = { ...emptyBoard[row][col], state: State.Covered };
            }
        }
        setBoard([]);
        setBoard(utils.getFilledBoard(ROWS, COLS, NUM_MINES));

    }

    useEffect(() => console.log(board), [board]);
    
    return (
        <main className="flex h-screen min-h-screen flex-col items-center px-24 py-12 gap-2">
            <section className="flex flex-col gap-4">
                {/* Notification Overlays */}
                {/* Game Won */}
                {gameWon && <div className="absolute z-10 min-w-game-width min-h-game-height">
                    {<h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black text-3xl font-bold p-4 bg-white/75 rounded-full">
                        You Win!
                    </h2>}
                </div>}
                {/* Game Over */}
                {gameLost && <div className="absolute z-10 min-w-game-width min-h-game-height">
                    {<h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black text-3xl font-bold p-4 bg-white/75 rounded-full">
                        Game Over
                    </h2>}
                </div>}

                {/* Game Board */}
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

                {/* Controls */}
                <div className="flex gap-4 items-center">
                    {/* TODO Add controls here like reset etc, and add styling to make it appear more like a control bar*/}
                    <h3 className="font-semibold">Controls:</h3>
                    <button
                        className="border border-black p-1 hover:bg-green-400"
                        onClick={playGame}
                    >
                        Play
                    </button>
                </div>
            </section>
        </main>
    )
}