'use client';
import MinesweeperCell from "../../components/MinesweeperCell"
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react"
import { Cell, State } from "./utils";
import { createMinesweeperScore } from "@/src/lib/actions";
import { images } from "@/src/assets/minesweeperImages";
import * as utils from './utils';
import Image from "next/image";
import NotificationOverlay from "@/app/components/NotificationOverlay";

const ROWS = 10;
const COLS = 10;
const NUM_MINES = 25;
const game_lost_image = images.gameOver;
const game_won_image = images.gameWon;

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
    const [heightIsLarger, setHeightIsLarger] = useState<boolean>(false);
    const [widthIsLarger, setWidthIsLarger] = useState<boolean>(true);

    // Timer interval
    useEffect(() => {
        let timerInterval: ReturnType<typeof setInterval>;

        if (gameRunning) {
            timerInterval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        }

        return () => clearInterval(timerInterval);
    }, [gameRunning]);

    /*
    Window resize event listener. Used to set board
    to full height or full width depending on which is smaller.
    This way, the aspect ratio remains 1:1 without causing overflow.
    */
    useEffect(() => {
        // TODO Check parent container instead and manually set width and height to the min
        // of the parent's available width and height.
        function onResize(e: any) {
            const { innerWidth, innerHeight } = e.target;
            if (innerHeight > innerWidth) {
                setHeightIsLarger(true);
                setWidthIsLarger(false);
            } else {
                setHeightIsLarger(false);
                setWidthIsLarger(true);
            }
        }

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

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
        <section className="flex flex-col gap-4 justify-center items-center h-full w-full">
            <div className="flex gap-4">
                <h2>Cleared: {clearedCellsCount}</h2>
                <h2>Mines: {NUM_MINES - numFlags >= 0 ? NUM_MINES - numFlags : 0}</h2>
                <h2>Time: {Math.floor((seconds / (60 * 60)) % 24)}:{Math.floor((seconds / 60) % 60)}:{seconds % 60}</h2>
            </div>
            

            {/* Game Board Container */}
            {widthIsLarger && <div className="relative h-full aspect-square">
                {/* Notification Overlays */}
                <NotificationOverlay src={game_lost_image} visible={gameLost} />
                <NotificationOverlay src={game_won_image} visible={gameWon} />

                {/* Board */}
                <div className="w-full h-full grid grid-rows-equal-10 grid-cols-equal-10">
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
                </div>
            </div>}
            {heightIsLarger && <div className="relative  w-full aspect-square">
                {/* Notification Overlays */}
                <NotificationOverlay src={game_lost_image} visible={gameLost} />
                <NotificationOverlay src={game_won_image} visible={gameWon} />

                {/* Board */}
                <div className="w-full h-full grid grid-rows-equal-10 grid-cols-equal-10">
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
                </div>
            </div>}

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