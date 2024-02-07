'use client';

import { useState, useEffect } from "react";
import { createMinesweeperScore } from "@/src/lib/actions";
import { useSession } from "next-auth/react";
import * as utils from './utils';

export default function Game() {
    const ROWS = 10;
    const COLS = 10;
    const NUM_MINES = 25;
    const { data: session } = useSession();
    const [board, setBoard] = useState<number[][]>([[]]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [flags, setFlags] = useState<number[][]>([[]]);
    const [numFlags, setNumFlags] = useState<number>(0);
    const [clearedCells, setClearedCells] = useState<[number, number][]>([]);
    const [seconds, setSeconds] = useState<number>(0);
    const [gameRunning, setGameRunning] = useState<boolean>(false);
    const [firstMove, setFirstMove] = useState<boolean>(false);

    // Timer interval
    useEffect(() => {
        let timerInterval: ReturnType<typeof setInterval>;

        if (gameRunning) {
            timerInterval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        }

        return () => clearInterval(timerInterval);
    }, [gameRunning]);

    /**
     * Sets the board to a new minesweeper board 
     */
    function setupBoard() {
        setBoard([]);

        const mineBoard = utils.getMineBoard(ROWS, COLS, NUM_MINES);
        const newBoard = utils.getFilledBoard(mineBoard);
        console.log(newBoard);

        setBoard(newBoard);
    }

    /**
     * Automatically clears cells adjacent to the one at the given position where possible.
     * @param {[number, number]} position 
     * @param {[number, number][]} clearedCells
     * @returns {[number, number][]}
     */
    function autoClearCells(position: [number, number], clearedCells: [number, number][]): [number, number][] {
        console.log(board);
        let q: [number, number][] = [];
        let visited: [number, number][] = [...clearedCells];
        let newClearedCells: [number, number][] = [];
        q.push(position);

        while (q.length > 0) {
            const [row, col]: [number, number] = q[0]; 
            q = q.slice(1);
            // TODO figure out why there is overlap when adding to visited list so this check doesn't always need to be done.
            const inVisited = !!visited.find(([r, c]: [number, number]) => r === row && c === col);
            if (!inVisited) visited.push([row, col]);
            
            const directions: [number, number][] = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
            let numFlags = 0;
            let numUncleared = 0;
            for (let dir of directions) {
                const newRow: number = Number(row) + Number(dir[0]);
                const newCol: number = Number(col) + Number(dir[1]);
                if (0 <= newRow && newRow < ROWS && 0 <= newCol && newCol < COLS) {
                    const cellCleared = !!clearedCells.find(([r, c]: [number, number]) => r === newRow && c === newCol);
                    if (flags[newRow][newCol]) numFlags++;
                    else if (!cellCleared) numUncleared++;
                }
            }

            if (board[row][col] === 0 || board[row][col] - numFlags === 0) {
                for (let dir of directions) {
                    const newRow: number = Number(row) + Number(dir[0]);
                    const newCol: number = Number(col) + Number(dir[1]);
                    const positionVisited = !!visited.find(([r, c]: [number, number]) => r === newRow && c === newCol);
                    if (
                        newRow >= 0 && newRow < ROWS &&
                        newCol >= 0 && newCol < COLS &&
                        !positionVisited &&
                        !flags[newRow][newCol]
                    ) {
                        const cell = document.getElementById(`${newRow}-${newCol}`);
                        if (cell) {
                            cell.innerHTML = String(board[newRow][newCol]);
                            cell.style.backgroundColor = "transparent";
                            cell.style.cursor = "default";
                            const cleared = !!clearedCells.find(([r, c]: [number, number]) => r === newRow && c === newCol);
                            const visited = !!newClearedCells.find(([r, c]: [number, number]) => r === newRow && c === newCol);
                            if (!cleared && !visited) newClearedCells.push([newRow, newCol]);
                        }
                        if (board[newRow][newCol] === -1) {
                            endGame(false);
                            return newClearedCells;
                        }
                        if (board[newRow][newCol] === 0) q.push([newRow, newCol]);
                    }
                }
            }
        }

        console.log('autocleared:', newClearedCells);
        return newClearedCells;
    }

    /**
     * Reveals a cell when the user clicks on it.
     * @param event 
     */
    function clearCell(event: any) {
        let currentBoard = [...board];
        const cell = event.target;
        const row: number = Number(cell.id.split('-')[0]);
        const col: number = Number(cell.id.split('-')[1]);
        const cellIsMine = board[row][col] === -1;
        const cleared = !!clearedCells.find(([r, c]: [number, number]) => r === row && c === col);
        let newClearedCells: [number, number][] = [...clearedCells];
        if (!cleared) newClearedCells.push([row, col]);

        if (!cellIsMine && (board[row][col] === 0 || cleared)) newClearedCells = [...newClearedCells, ...autoClearCells([row, col], newClearedCells)];
        else if (firstMove) {
            currentBoard = getSafeBoard(row, col, board);
        }
        else if (cellIsMine) {
            endGame(false);
        }

        cell.innerHTML = currentBoard[row][col];
        cell.style.backgroundColor = "transparent";
        cell.style.cursor = "default";

        console.log(newClearedCells);
        setClearedCells(newClearedCells);
        if (firstMove) setFirstMove(false);
        if (newClearedCells.length === (ROWS * COLS) - NUM_MINES) {
            endGame(true);
        }
    }

    /**
     * Moves a mine at position [row, col] in board to
     * a random empty cell within board and returns the updated board.
     * @param {number} row 
     * @param {number} col 
     * @returns {number[][]}  
     */
    function getSafeBoard(row: number, col: number, board: number[][]): number[][] {
        // Check preconditions
        if (
            row >= board.length || row < 0 ||
            col >= board[row].length || col < 0 ||
            board[row][col] !== -1
        ) return board; 

        const emptyCells: [number, number][] = [];
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c] !== -1) emptyCells.push([r, c]);
            }
        }

        let newBoard = [...board];
        const [newRow, newCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        newBoard[newRow][newCol] = -1;
        newBoard[row][col] = 0;
        newBoard = utils.getFilledBoard(newBoard);
        setBoard(newBoard);

        return newBoard;
    }

    /**
     * Flags a cell as a mine when the user right clicks on it. 
     * @param event 
     */
    function flagCell(event: any) {
        event.preventDefault();
        const cell = event.target;
        const row = Number(cell.id.split('-')[0]);
        const col = Number(cell.id.split('-')[1]);

        const cellCleared = clearedCells.find(([r, c]: [number, number]) => r === row && c === col);
        if (cellCleared) return;

        let newFlags = [...flags];
        if (cell.style.backgroundColor === 'crimson') {
            cell.style.backgroundColor = 'gold';
            newFlags[row][col] = -1;
            setNumFlags(prev => prev - 1);
        }
        else if (cell.style.backgroundColor === 'gold') {
            cell.style.backgroundColor = 'black';
            newFlags[row][col] = 0;
            setNumFlags(prev => prev - 1);
        }
        else {
            cell.style.backgroundColor = 'crimson';
            newFlags[row][col] = 1;
            setNumFlags(prev => prev + 1);
        }
        setFlags(newFlags);
    }

    /**
     * Resets the state of the game including generating a new board so that
     * it is at the start of a new game.
     */
    function playGame() {
        // Reset cell styles from old board state
        if (clearedCells.length > 0) {
            setClearedCells([]);
        }
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const cell = document.getElementById(`${row}-${col}`)
                if (cell) {
                    cell.style.backgroundColor = 'black';
                    cell.innerHTML = '';
                    cell.style.cursor = 'pointer';
                }
            }
        }
        for (let row = 0; row < flags.length; row++) {
            for (let col = 0; col < flags[row].length; col++) {
                if (flags[row][col] != 0) {
                    const cell = document.getElementById(`${row}-${col}`)
                    if (cell) {
                        cell.style.backgroundColor = 'black';
                        cell.innerHTML = '';
                        cell.style.cursor = 'pointer';
                    }
                }
            }
        }

        // Reset state
        setGameOver(false);
        setGameWon(false);
        setGameRunning(true);
        setFirstMove(true);
        setupBoard();
        setFlags(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
        setNumFlags(0);
        setSeconds(0);
    }

    /**
     * Saves the game score 
     * @param {boolean} win 
     */
    async function saveScore(win: boolean) {
        if (!session) return;
        const newScore = {
            uid: session?.user?.id,
            time: seconds,
            numMines: NUM_MINES,
            win: win, 
            numCleared: clearedCells.length,
            numRows: ROWS,
            numCols: COLS,
        };
        await createMinesweeperScore(newScore);
    }

    /**
     * Sets the game to the correct state based on whether or not the player won. 
     * Also saves the score if they won.
     * @param {boolean} win 
     */
    function endGame(win: boolean) {
        if (!gameRunning) return;
        if (win) {
            setGameWon(true);
        }
        else {
            setGameOver(true);
        }
        saveScore(win);
        setGameRunning(false);
    }

    return (
        <section className="flex flex-col gap-3">
            <div className="flex gap-4">
                <h2>Cleared: {clearedCells.length}</h2>
                <h2>Mines: {NUM_MINES - numFlags}</h2>
                <h2>Time: {Math.floor((seconds / (60 * 60)) % 24)}:{Math.floor((seconds / 60) % 60)}:{seconds % 60}</h2> 
            </div>
            <div>
                {/* Notification Overlays */}
                {/* Game Won */}
                {gameWon && <div className="absolute min-w-game-width min-h-game-height">
                    {<h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white text-3xl">
                        You Win!
                    </h2>}
                </div>}
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