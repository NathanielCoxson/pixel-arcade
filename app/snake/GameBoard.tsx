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
 
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>([]);
    const movementInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const ROWS: number = 25;
    const COLS: number = 25;
    // TODO refactor the colors into an enum to make this cleaner
    const ON_COLOR: string = 'black';
    const OFF_COLOR: string = 'rgb(30 41 59 / var(--tw-bg-opacity))';
    const FOOD_COLOR: string = 'green';
    const colors = [OFF_COLOR, ON_COLOR, FOOD_COLOR];

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
     * Returns the number of the cell represented by the given coordinate row and column.
     * Example: {row: 1, col: 0} => ROWS * 1 + 0
     * @param {Coordinate} location
     */
    function getCellIdFromCoordinates (location: Coordinate): number {
        return (location[0] * ROWS + location[1]);
    }

    /**
     * Sets the background of the cell with the given id to the on color.
     * @param {Coordinate} location 
     */
    function enableCell(location: Coordinate): void {
        const id = getCellIdFromCoordinates(location);
        const cell = document.getElementById(`cell-${id}`);
        if (cell) {
            cell.style.backgroundColor = ON_COLOR;
        }
    }

    /**
     * Sets the background of the cell with the given id to the off color.
     * @param {Coordinate} location  
     */
    function disableCell(location: Coordinate): void {
        const id = getCellIdFromCoordinates(location);
        const cell = document.getElementById(`cell-${id}`);
        if (cell) {
            cell.style.backgroundColor = OFF_COLOR;
        }
    }
    
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
        // setTestBoard(prev => {
        //     prev[foodCoordinate[0]][foodCoordinate[1]] = 2;
        //     return prev;
        // });
        setCellValue(foodCoordinate, 2);
        // board[foodCoordinate[0]][foodCoordinate[1]] = 2;
        
        // Set cell to food color
        // const id = getCellIdFromCoordinates(foodCoordinate);
        // const cell = document.getElementById(`cell-${id}`);
        // if (cell) {
        //     cell.style.backgroundColor = FOOD_COLOR;
        // }

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

    // TODO refactor this function so that it is only responsible for starting the game loop interval and 
    // setting up the initial game state. Control of the loop should be passed to the top level component function afterwards.
    function playGame() {
        setScore(0);
        const startRow = 0;
        const startCol = 0;
        setCellValue([startRow, startCol], 1);

        // Snake properties
        let head: Coordinate = [startRow, startCol];
        let snakeCoords: Coordinate[] = [head];

        placeFood(board);
        // enableCell(head);
        let currDirection: Direction | undefined = Direction.Right;

        // Sets the current direction when an arrow key is pressed down.
        document.addEventListener('keydown', (event) => {
            const key: String = event.key;
            const arrowKeys: Map<String, Direction> = new Map([
                ["ArrowUp", Direction.Up],
                ["ArrowDown", Direction.Down],
                ["ArrowLeft", Direction.Left],
                ["ArrowRight", Direction.Right],
            ]);

            if (arrowKeys.has(key)) {
                currDirection = arrowKeys.get(key);
            }
        });

        // TODO move this outside of this function
        function move() {
            head = getNextLocation(head, currDirection);
            const headRow = head[0];
            const headCol = head[1];
            const tail: Coordinate = snakeCoords[0];

            const intersected = board[headRow][headCol] === 1;
            const outOfBounds = headRow < 0 || headRow >= ROWS || headCol < 0 || headCol >= COLS;
            if (outOfBounds || intersected) {
                setGameOver(true);
                clearInterval(interval);
                return;
            }

            const eatFood = board[headRow][headCol] === 2
            if (eatFood) {
                placeFood(board);
                setScore(prev => prev + 1);
            }
            // Remove old tail after the move if no food was eaten
            else {
                disableCell(snakeCoords[0]);
                setCellValue(tail, 0);
                snakeCoords = snakeCoords.slice(1);
            }
            
            // Add new head coordinate
            snakeCoords.push(head);
            setCellValue(head, 1);
        }

        // Movement interval
        // TODO move interval outside of this function to allow for control after the game starts
        let interval = setInterval(move, 500);
    }

    return (
        <section>
            <h2 className="text-center">Score: {score}</h2>
            {/* <div className="grid grid-rows-25 grid-cols-25 min-w-game-width min-h-game-height bg-slate-800">
                {[...Array(ROWS * COLS)].map((value: undefined, i: number) =>
                    <div
                        key={`pixel-${i}`}
                        id={`cell-${i}`}
                        className="w-full h-full"
                    />
                )}
            </div> */}
            <div className="grid grid-rows-25 grid-cols-25 min-w-game-width min-h-game-height bg-slate-800">
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
            <div className="flex gap-4 items-center py-4">
                {/* TODO Add controls here like reset etc, and add styling to make it appear more like a control bar*/}
                <h3 className="font-semibold">Controls:</h3>
                <button 
                    className="border border-black p-1 hover:bg-green-400"
                    onClick={playGame}
                >
                    Play
                </button>
                <button 
                    className="border border-black p-1 hover:bg-green-400"
                >
                    Pause
                </button>
            </div>
        </section>

    )
}