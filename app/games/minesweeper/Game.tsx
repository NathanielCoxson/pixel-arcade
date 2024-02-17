'use client';
import MinesweeperCell from "../../components/MinesweeperCell"
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, SyntheticEvent } from "react"
import { Cell, State } from "./utils";
import { createMinesweeperScore } from "@/src/lib/actions";
import { images } from "@/src/assets/minesweeperImages";
import * as utils from './utils';
import NotificationOverlay from "@/app/components/NotificationOverlay";
import GameOverlay from "@/app/components/GameOverlay";

enum Difficulty {
    Easy,
    Medium,
    Hard
}

const ROWS = 10;
const COLS = 10;
const NUM_MINES = 25;
const game_lost_image = images.gameOver;
const game_won_image = images.gameWon;


export default function Game() {

    // Session
    const { data: session } = useSession();
    // Board
    const [board, setBoard] = useState<Cell[][]>(utils.getFilledBoard(ROWS, COLS, NUM_MINES));
    const [rows, setRows] = useState<number>(ROWS);
    const [cols, setCols] = useState<number>(COLS);
    const [numMines, setNumMines] = useState<number>(NUM_MINES);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
    // Game state
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [gameLost, setGameLost] = useState<boolean>(false);
    const [gameRunning, setGameRunning] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(0);
    const [clearedCellsCount, setClearedCellsCount] = useState<number>(0);
    const [numFlags, setNumFlags] = useState<number>(0);
    const [firstMove, setFirstMove] = useState<boolean>(true);
    const [selectingDifficulty, setSelectingDifficulty] = useState<boolean>(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.Easy);

    // Timer interval
    useEffect(() => {
        if (!gameRunning) return;

        let timerInterval: ReturnType<typeof setInterval> = setInterval(() => setSeconds(prev => prev + 1), 1000);

        return () => clearInterval(timerInterval);
    }, [gameRunning]);

    // Difficulty change effect
    useEffect(() => {
        // Update board state
        let newRows: number;
        let newCols: number;
        let newNumMines: number;
        switch (difficulty) {
            case Difficulty.Easy:
                newRows = 10, newCols = 10, newNumMines = 25;
                break;
            case Difficulty.Medium:
                newRows = 15, newCols = 15, newNumMines = 35;
                break;
            case Difficulty.Hard:
                newRows = 20, newCols = 20, newNumMines = 45;
                break;
            default:
                newRows = 10, newCols = 10, newNumMines = 25;
                break;
        }
        setRows(newRows);
        setCols(newCols);
        setNumMines(newNumMines);
        setBoard([]);
        setBoard(utils.getFilledBoard(newRows, newCols, newNumMines));

        // Reset game state
        setGameWon(false);
        setGameLost(false);
        setGameRunning(false);
        setClearedCellsCount(0);
        setNumFlags(0);
        setSeconds(0);
        setFirstMove(true);
    }, [difficulty]);

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
            numMines: numMines,
            win: win,
            numCleared: clearedCellsCount + numCleared,
            numRows: rows,
            numCols: cols,
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
        if (!gameRunning) setGameRunning(true);

        let newBoard: Cell[][] = [];

        if (firstMove && board[row][col].value === -1) newBoard = utils.getSafeBoard(board, row, col, rows, cols, numMines); 
        else newBoard = [...board];
        if (firstMove) setFirstMove(false);

        const { numCleared, success } = utils.clearFromCell(row, col, newBoard);

        setBoard(newBoard);
        
        if (!success) {
            endGame(false, numCleared);
        } 
        else if (numCleared + clearedCellsCount === (rows * cols) - numMines) {
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
        setGameRunning(false);
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
        setBoard(utils.getFilledBoard(rows, cols, numMines));
    }

    function handleDifficultySelectSubmit(e: SyntheticEvent) {
        e.preventDefault();

        setDifficulty(selectedDifficulty);

        setSelectingDifficulty(false);
    }

    return (
        <section className="flex flex-col gap-4 justify-center items-center h-full w-full">
            <div className="flex gap-4">
                <h2>Cleared: {clearedCellsCount}</h2>
                <h2>Mines: {numMines - numFlags >= 0 ? numMines - numFlags : 0}</h2>
                <h2>Time: {Math.floor((seconds / (60 * 60)) % 24)}:{Math.floor((seconds / 60) % 60)}:{seconds % 60}</h2>
            </div>
            

            {/* Game Board Container */}
           <div className="relative w-full max-w-[75vh] after:pb-[100%] after:content-[''] after:block overflow-hidden" >
                {/* Notification Overlays */}
                <NotificationOverlay src={game_won_image} visible={gameWon} />
                <NotificationOverlay src={game_lost_image} visible={gameLost} />
                {/* Game paused/waiting to start overlay */}
                <GameOverlay visible={selectingDifficulty}>
                    <div className="flex flex-col items-center justify-top bg-slate-200 w-1/2 h-1/2 p-10">
                        <h1>Select Difficulty:</h1>
                        <form onSubmit={handleDifficultySelectSubmit} className="flex flex-col">
                            <div className="flex flex-col justify-between">
                                <fieldset>
                                    <div className="flex gap-4 justify-between">
                                        <label htmlFor="difficulty-easy">Easy</label>
                                        <div className="flex gap-4">
                                            <p>10x10, 25 Mines</p>
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={Difficulty.Easy}
                                                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 justify-between">
                                        <label htmlFor="difficulty-medium">Medium</label>
                                        <div className="flex gap-4">
                                            <p>15x15, 35 Mines</p>
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={Difficulty.Medium}
                                                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 justify-between">
                                        <label htmlFor="difficulty-hard">Hard</label>
                                        <div className="flex gap-4">
                                            <p>20x20, 45 Mines</p>
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={Difficulty.Hard}
                                                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <button type="submit" className="hover:font-semibold transition-all">Submit</button>
                        </form>
                    </div>
                </GameOverlay>

                {/* Board */}
                {difficulty === Difficulty.Easy && <div className="w-full h-full grid grid-rows-equal-10 grid-cols-equal-10">
                    {board.map((row: Cell[], i: number) => {
                        return row.map((value: Cell, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="relative flex flex-wrap cursor-pointer text-center justify-center content-center select-none"
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
                </div>}
                {difficulty === Difficulty.Medium && <div className="w-full h-full grid grid-rows-equal-15 grid-cols-equal-15">
                    {board.map((row: Cell[], i: number) => {
                        return row.map((value: Cell, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="relative flex flex-wrap cursor-pointer text-center justify-center content-center select-none"
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
                </div>}
                {difficulty === Difficulty.Hard && <div className="w-full h-full grid grid-rows-equal-20 grid-cols-equal-20">
                    {board.map((row: Cell[], i: number) => {
                        return row.map((value: Cell, j: number) => {
                            return <div
                                key={`${i}-${j}`}
                                className="relative flex flex-wrap cursor-pointer text-center justify-center content-center select-none"
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
                </div>}
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center">
                {/* TODO Add controls here like reset etc, and add styling to make it appear more like a control bar*/}
                <h3 className="font-semibold">Controls:</h3>
                <button
                    className="border border-black p-1 hover:bg-slate-300"
                    onClick={playGame}
                >
                    Play
                </button>
                <button
                    className="border border-black p-1 hover:bg-slate-300"
                    onClick={(e) => setSelectingDifficulty(prev => !prev)}
                >
                    Settings
                </button>
                <select onChange={(e) => setDifficulty(Number(e.target.value))}>
                    <option value={Difficulty.Easy}>Easy</option>
                    <option value={Difficulty.Medium}>Medium</option>
                    <option value={Difficulty.Hard}>Hard</option>
                </select>
            </div>
        </section>
    )
}