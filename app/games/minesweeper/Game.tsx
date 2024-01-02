'use client'

import { useState, useCallback } from "react";

export default function Game() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;
    const [board, setBoard] = useState<number[][]>([[]]);
<<<<<<< HEAD
    const [gameOver, setGameOver] = useState<boolean>(false);
=======
    const [flags, setFlags] = useState<number[][]>([[]]);
>>>>>>> main

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

    /**
     * Automatically clears cells adjacent to the one at the given position where possible.
     * @param {[number, number]} position 
     */
    function autoClearCells(position: [number, number]): void {
        let q: [number, number][] = [];
        let visited: [number, number][] = [];
        q.push(position);

        while (q.length > 0) {
            const [row, col]: [number, number] = q[0]; 
            q = q.slice(1);
            visited.push([row, col]);
            
            // TODO remove diagonal direction checking which could solve issue #38 
            const directions: [number, number][] = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
            for (let dir of directions) {
                const newRow: number = Number(row) + Number(dir[0]);
                const newCol: number = Number(col) + Number(dir[1]);
                const positionVisited = !!visited.find(([r, c]: [number, number]) => r === newRow && c === newCol);
                if (
                    newRow >= 0 && newRow < ROWS &&
                    newCol >= 0 && newCol < COLS &&
                    board[newRow][newCol] !== -1 &&
                    !positionVisited
                ) {
                    // TODO consider refactoring this since it is a repeat from the clearCell function
                    const cell = document.getElementById(`${newRow}-${newCol}`);
                    if (cell) {
                        cell.innerHTML = String(board[newRow][newCol]);
                        cell.style.backgroundColor = "transparent";
                        cell.style.cursor = "default";
                    }
                } 
            }
        }
    }

    /**
     * Reveals a cell when the user clicks on it.
     * @param event 
     */
    function clearCell(event: any) {
        const cell = event.target;
        const row = cell.id.split('-')[0];
        const col = cell.id.split('-')[1];
        cell.innerHTML = board[row][col];
        cell.style.backgroundColor = "transparent";
        cell.style.cursor = "default";

        if (board[row][col] !== -1) autoClearCells([row, col]);
        else setGameOver(true);
    }

    /**
     * Flags a cell as a mine when the user right clicks on it. 
     * @param event 
     */
    function flagCell(event: any) {
        event.preventDefault();
        const cell = event.target;
        const row = cell.id.split('-')[0];
        const col = cell.id.split('-')[1];
        let newFlags = [...flags];
        if (cell.style.backgroundColor === 'crimson') {
            cell.style.backgroundColor = 'black';
            newFlags[row][col] = 0;
        }
        else {
            cell.style.backgroundColor = 'crimson';
            newFlags[row][col] = 1;
        }
        setFlags(newFlags);
    }

    /**
     * Resets the state of the game including generating a new board so that
     * it is at the start of a new game.
     */
    function playGame() {
        setGameOver(false);
        placeMines();
        setFlags(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    }

    return (
        <section className="flex flex-col gap-3">
            <div>
                {/* Notification Overlays */}
                {/* Game Over */}
                {gameOver && <div className="absolute min-w-game-width min-h-game-height">
                    {<h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white text-3xl">
                        Game Over
                    </h2>}
                </div>}

                {/* Game Board */}
                <div className="grid grid-cols-equal-10 grid-rows-equal-10 min-w-game-width min-h-game-height bg-slate-800">
                    {board.map((row: number[], i: number) => {
                        return row.map((value: number, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                id={`${i}-${j}`}
                                className="max-h-full max-w-full flex flex-wrap border cursor-pointer border-slate-500 text-center justify-center content-center text-white bg-black select-none"
                                onClick={clearCell}
                                onContextMenu={flagCell}
                            >
                            </div>
                        })
                    })}
                </div>
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
    )
}