'use client';
import MinesweeperCell from "../../components/MinesweeperCell"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import { Cell, State } from "./utils";
import { createMinesweeperScore } from "@/src/lib/actions";
import * as utils from './utils';

const ROWS = 10;
const COLS = 10;
const NUM_MINES = 25;

export default function Game() {

    const { data: session } = useSession();
    const [board, setBoard] = useState<Cell[][]>(utils.getFilledBoard(ROWS, COLS, NUM_MINES));
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [gameLost, setGameLost] = useState<boolean>(false);
    const [gameRunning, setGameRunning] = useState<boolean>(true);
    const [seconds, setSeconds] = useState<number>(0);
    const [clearedCellsCount, setClearedCellsCount] = useState<number>(0);
    const [numFlags, setNumFlags] = useState<number>(0);
    const [firstMove, setFirstMove] = useState<boolean>(true);

    // Timer interval
    useEffect(() => {
        let timerInterval: ReturnType<typeof setInterval>;

        if (gameRunning) {
            timerInterval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        }

        return () => clearInterval(timerInterval);
    }, [gameRunning]);

    /**
     * Saves the game score 
     * @param {boolean} win 
     * @param {number} numCleared
     */
    async function saveScore(win: boolean, numCleared: number) {
        if (!session) return;
        const newScore = {
            uid: session?.user?.id,
            time: seconds,
            numMines: NUM_MINES,
            win: win,
            numCleared: clearedCellsCount + numCleared,
            numRows: ROWS,
            numCols: COLS,
        };
        await createMinesweeperScore(newScore);
    }

    /**
     * Sets the game to the correct state based on whether or not the player won. 
     * Also saves the score if they won.
     * @param {boolean} win 
     * @param {number} numCleared
    */
    function endGame(win: boolean, numCleared: number) {
        if (!gameRunning) return;
        if (win) {
            setGameWon(true);
        }
        else {
            setGameLost(true);
        }
        saveScore(win, numCleared);
        setGameRunning(false);
    }

    function clearCell(row: number, col: number) {
        let newBoard: Cell[][] = [];

        if (firstMove && board[row][col].value === -1) newBoard = utils.getSafeBoard(board, row, col, ROWS, COLS, NUM_MINES); 
        else newBoard = [...board];
        if (firstMove) setFirstMove(false);

        const { numCleared, success } = utils.clearFromCell(row, col, newBoard);
        console.log(numCleared);

        setBoard(newBoard);
        
        if (!success) {
            endGame(false, numCleared);
        } 
        else if (numCleared + clearedCellsCount === (ROWS * COLS) - NUM_MINES) {
            endGame(true, numCleared);
        }
        setClearedCellsCount(prev => prev + numCleared);
    }

    function flagCell(row: number, col: number) {
        // Update flag count
        if (board[row][col].state !== State.Flagged) setNumFlags(prev => prev + 1);
        else setNumFlags(prev => prev - 1);

        const newBoard = [...board];
        const currentState = newBoard[row][col].state;
        const state = currentState === State.Flagged ? State.Covered : State.Flagged;
        newBoard[row][col] = { ...newBoard[row][col], state };
        setBoard(newBoard);
    }

    function playGame() {
        setGameWon(false);
        setGameLost(false);
        setGameRunning(true);
        setClearedCellsCount(0);
        setNumFlags(0);
        setSeconds(0);
        setFirstMove(true);

        const emptyBoard = [...board];
        for (let row = 0; row < emptyBoard.length; row++) {
            for (let col = 0; col < emptyBoard[row].length; col++) {
                emptyBoard[row][col] = { ...emptyBoard[row][col], state: State.Covered };
            }
        }
        setBoard([]);
        setBoard(utils.getFilledBoard(ROWS, COLS, NUM_MINES));
    }

    return (
        <section className="flex flex-col gap-4">
            <div className="flex gap-4">
                <h2>Cleared: {clearedCellsCount}</h2>
                <h2>Mines: {NUM_MINES - numFlags >= 0 ? NUM_MINES - numFlags : 0}</h2>
                <h2>Time: {Math.floor((seconds / (60 * 60)) % 24)}:{Math.floor((seconds / 60) % 60)}:{seconds % 60}</h2>
            </div>
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
    )
}