'use client'

import { useEffect, useState, useCallback } from "react";

export default function Game() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;
    const [board, setBoard] = useState<number[][]>([[]]);

    /**
     * Randomly shuffles the given array
     * @param {number[]} arr 
     * @returns {number[]}
     */
    function shuffleArray(arr: number[]): number[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * i);
            [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
        }
        return arr;
    }

    /**
     * Places mines randomly within the board matrix
     */
    const placeMines = useCallback(() => {
        let newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        const totalPixels = ROWS * COLS;
        const positions = Array.from({ length: totalPixels }, (_, index) => index);
        const minePositions = shuffleArray(positions).slice(0, NUM_MINES);

        for (let pos of minePositions) {
            const row = Math.floor(pos / COLS);
            const col = pos % COLS;
            newBoard[row][col] = -1; 
        }
        setBoard(newBoard);
    }, []);

    // Place mines when the game is opened
    // TODO move this to a playGame function similar to snake where mines are placed each time the play button gets pressed
    useEffect(() => {
        placeMines();
    }, [placeMines]);

    /**
     * Sets the background of a pixel to black when the mouse enters
     * @param event 
     */
    function onCellMouseOver(event: any) {
        event.target.style.backgroundColor = 'black';
    }

    /**
     * Sets the background of a pixel to the default color when the mouse exits
     * @param event 
     */
    function onCellMouseOut(event: any) {
        event.target.style.backgroundColor = "rgb(30 41 59 / var(--tw-bg-opacity))";
    } 

    return (
        <section>
            <div>
                {/* Game Board */}
                <div className="grid grid-rows-10 grid-cols-10 min-w-game-width min-h-game-height bg-slate-800">
                    {board.map((row: number[], i: number) => {
                        return row.map((value: number, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="w-full h-full flex flex-wrap border cursor-pointer border-slate-500 text-center justify-center content-center text-white"
                                onMouseOver={onCellMouseOver}
                                onMouseOut={onCellMouseOut}
                            >
                                {value}
                            </div>
                        })
                    })}
                </div>
            </div>
        </section>
    )
}