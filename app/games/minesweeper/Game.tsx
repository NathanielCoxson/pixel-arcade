'use client'

import { useEffect, useState, useCallback } from "react";

export default function Game() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;
    const [board, setBoard] = useState<number[][]>([[]]);

    /**
     * Returns an array which contains the numbers
     * of the given array but shuffled.
     * @param {number[]} arr 
     * @returns {number[]}
     */
    function getShuffledArray(arr: number[]): number[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * i);
            [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
        }
        return arr;
    }

    // TODO make this not a callback after the playGame function is created, since this will no longer
    // be called inside of a useEffect
    /**
     * Places mines randomly within the board matrix
     */
    const placeMines = useCallback(() => {
        let newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        const totalPixels = ROWS * COLS;
        const positions = Array.from({ length: totalPixels }, (_, index) => index);
        const minePositions = getShuffledArray(positions).slice(0, NUM_MINES);

        for (let pos of minePositions) {
            const row = Math.floor(pos / COLS);
            const col = pos % COLS;
            newBoard[row][col] = -1; 
        }

        const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        for (let row = 0; row < newBoard.length; row++) {
            for (let col = 0; col < newBoard[row].length; col++) {
                if (newBoard[row][col] === -1) continue;
                let count = 0;
                for (let dir of directions) {
                    const newRow = row + dir[0];
                    const newCol = col + dir[1];
                    if (
                        0 <= newRow && newRow < ROWS &&
                        0 <= newCol && newCol < COLS &&
                        newBoard[newRow][newCol] === -1
                    ) count++;
                }
                newBoard[row][col] = count;
            }
        }

        setBoard(newBoard);
    }, []);

    // Place mines when the game is opened
    // TODO move this to a playGame function similar to snake where mines are placed each time the play button gets pressed
    useEffect(() => {
        placeMines();
    }, [placeMines]);

    /**
     * Reveals a cell when the user clicks on it.
     * @param event 
     */
    function revealCell(event: any) {
        const cell = event.target;
        const row = cell.id.split('-')[0];
        const col = cell.id.split('-')[1];
        cell.innerHTML = board[row][col];
        cell.style.backgroundColor = "transparent";
    }

    return (
        <section>
            <div>
                {/* Game Board */}
                <div className="grid grid-cols-equal-10 grid-rows-equal-10 min-w-game-width min-h-game-height bg-slate-800">
                    {board.map((row: number[], i: number) => {
                        return row.map((value: number, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                id={`${i}-${j}`}
                                className="max-h-full max-w-full flex flex-wrap border cursor-pointer border-slate-500 text-center justify-center content-center text-white bg-black"
                                onClick={revealCell}
                            >
                            </div>
                        })
                    })}
                </div>
            </div>
        </section>
    )
}