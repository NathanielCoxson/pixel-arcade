'use client'

import { useEffect, useState, useRef } from "react";

export default function GameBoard() {
    enum Direction {
        Up,
        Down,
        Left,
        Right,
    };
    type Coordinate = [number, number];

    const ROWS: number = 4;
    const COLS: number = 4;
    const MAX_SCORE: number = ROWS * COLS - 1;
    // TODO refactor the colors into an enum to make this cleaner
    const ON_COLOR: string = 'black';
    const OFF_COLOR: string = 'rgb(30 41 59 / var(--tw-bg-opacity))';
    const FOOD_COLOR: string = 'green';
    const colors = [OFF_COLOR, ON_COLOR, FOOD_COLOR];
 
    const [gameOver, setGameOver] = useState(false);
    const [gamePaused, setGamePaused] = useState(false);
    const [displayedScore, setDisplayedScore] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>([]);
    const [prevSnakeCoords, setPrevSnakeCoords] = useState<Coordinate[]>([]);
    const [prevDirection, setPrevDirection] = useState<Direction | undefined>(Direction.Right);
    const interval = useRef<ReturnType<typeof setInterval>>();
    let head: Coordinate = [0, 0];
    let snakeCoords: Coordinate[] = [];
    let currDirection: Direction | undefined = Direction.Right;
    let score: number = 0;

    useEffect(() => {
        let arr = [];
        for (let row = 0; row < ROWS; row++) {
            let rowArr = [];
            for (let col = 0; col < COLS; col++) {
                rowArr.push(0);
            }
            arr.push(rowArr);
        }
        setBoard(arr);
    }, []);

    
    /**
     * Places food at a random location on the screen and returns the coordinate
     * location of that food so the board can be updated.
     * @param {number[][]} board The current board
     * @returns {Coordinate} The location of the food that was placed.
     */
    function placeFood(board: number[][]): Coordinate {
        const openCells: Coordinate[] = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === 0) openCells.push([row, col]);
            }
        }

        const foodCoordinate: Coordinate = openCells[Math.floor(Math.random() * openCells.length)];
        setCellValue(foodCoordinate, 2);

        return foodCoordinate;
    }

    /**
     * Returns the resulting coordinate by moving one step in the given direction
     * beginning at the starting coordinate.
     * @param {Coordinate} start 
     * @param {Direction} direction 
     * @returns {Coordinate}
     */
    function getNextLocation(start: Coordinate, direction: Direction = Direction.Right): Coordinate {
        let newLocation: Coordinate = [...start];
        if (direction == Direction.Up) {
            newLocation[0] -= 1;
        }
        else if (direction == Direction.Down) {
            newLocation[0] += 1;
        }
        else if (direction == Direction.Left) {
            newLocation[1] -= 1;
        }
        else if (direction == Direction.Right) {
            newLocation[1] += 1;
        }
        return newLocation;
    }

    /**
     * Sets the value of the given location in the board array to the given color value.
     * @param {Coordinate} location 
     * @param {number} color 
     */
    function setCellValue(location: Coordinate, color: number): void {
        let newBoard = [...board];
        newBoard[location[0]][location[1]] = color;
        setBoard(newBoard);
    }

    /**
     * Performs cleanup once the game ends like clearing the movement 
     * interval and removing event listeners.
     */
    function endGame(): void {
        setGameOver(true);
        setGamePaused(false);
        clearInterval(interval.current);
        document.removeEventListener('keydown', arrowKeyDownListener);
    }

    /**
     * Pauses the game, saving the current state.
     */
    function pauseGame(): void {
        setGamePaused(true);
        clearInterval(interval.current);
    }

    /**
     * Resumes the game after a pause using the existing state.
     */
    function resumeGame(): void {
        snakeCoords = [...prevSnakeCoords];
        head = snakeCoords[snakeCoords.length - 1];
        currDirection = prevDirection;
        score = displayedScore;
        document.addEventListener('keydown', arrowKeyDownListener);
        setGamePaused(false);
        interval.current = setInterval(move, 500);
    }

    /**
     * Performs a single movement of the snake. 
     * @returns void
     */
    function move(): void {
        head = getNextLocation(head, currDirection);
        const headRow = head[0];
        const headCol = head[1];
        const tail: Coordinate = snakeCoords[0];

        const outOfBounds = headRow < 0 || headRow >= ROWS || headCol < 0 || headCol >= COLS;
        if (outOfBounds) {
            endGame();
            return;
        }

        const eatFood = board[headRow][headCol] === 2;
        if (eatFood) {
            setDisplayedScore(prev => prev + 1);
            score += 1;
            if (score === MAX_SCORE) {
                endGame();
            }
            else {
                placeFood(board);
            }
        }
        // Remove old tail after the move if no food was eaten
        else {
            setCellValue(tail, 0);
            snakeCoords = snakeCoords.slice(1);
        }

        const intersected = board[headRow][headCol] === 1;
        if (intersected) {
            endGame();
            return;
        }
        
        // Add new head coordinate
        snakeCoords.push(head);
        setPrevSnakeCoords(snakeCoords);
        setCellValue(head, 1);
    }

    /**
     * Listens for arrow key down events and updates the 
     * current direction based on which key is pressed down.
     * @param event 
     */
    function arrowKeyDownListener(event: any) {
        const key: String = event.key;
        const arrowKeys: Map<String, Direction> = new Map([
            ["ArrowUp", Direction.Up],
            ["ArrowDown", Direction.Down],
            ["ArrowLeft", Direction.Left],
            ["ArrowRight", Direction.Right],
        ]);

        if (arrowKeys.has(key)) {
            currDirection = arrowKeys.get(key);
            setPrevDirection(currDirection);
        }
    }

    function playGame() {
        let cleanBoard = [...board];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                cleanBoard[row][col] = 0;
            }
        }
        clearInterval(interval.current);
        document.removeEventListener('keydown', arrowKeyDownListener);
        setBoard(cleanBoard);
        setDisplayedScore(0);
        setGameOver(false);
        setGamePaused(false);
        const startRow = 0;
        const startCol = 0;

        // Snake properties
        head = [startRow, startCol];
        setCellValue(head, 1);
        snakeCoords = [head];

        placeFood(board);
        currDirection = Direction.Right;

        // Sets the current direction when an arrow key is pressed down.
        document.addEventListener('keydown', arrowKeyDownListener);

        interval.current = setInterval(move, 500);
    }

    // Cleanup
    useEffect(() => {
        return () => clearInterval(interval.current)
    }, []);

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-center text-3xl">Score: {displayedScore}</h2>
            <div>
                {/* Notification Overlays */}
                {/* Game Over */}
                {gameOver && <div className="absolute min-w-game-width min-h-game-height">
                    {displayedScore < MAX_SCORE && <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white text-3xl">
                        Game Over
                    </h2>}
                    {displayedScore === MAX_SCORE && <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white text-3xl">
                        You Win!
                    </h2>}
                </div>}
                {/* Game Paused */}
                {gamePaused && <div className="absolute min-w-game-width min-h-game-height">
                    <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white text-3xl">
                        Paused
                    </h2>
                </div>}

                {/* Game Board */}
                <div className="grid grid-rows-4 grid-cols-4 min-w-game-width min-h-game-height bg-slate-800">
                    
                    {board.map((row: number[], i: number) => {
                        return row.map((value: number, i: number) => 
                            <div
                                key={`pixel-${i}`}
                                id={`cell-${i}`}
                                className="w-full h-full"
                                style={{backgroundColor: colors[value]}}
                            >
                            </div>
                        )
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
                {!gamePaused && <button 
                    className="border border-black p-1 hover:bg-green-400"
                    onClick={pauseGame}
                >
                    Pause
                </button>}
                {gamePaused && <button 
                    className="border border-black p-1 hover:bg-green-400"
                    onClick={resumeGame}
                >
                    Resume
                </button>}
            </div>
        </section>

    )
}
