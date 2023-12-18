'use client'

import { useCallback, useEffect, useState, useRef } from "react";

export default function GameBoard() {
    enum Direction {
        Up,
        Down,
        Left,
        Right,
    }
    type Coordinate = [number, number];
 
    const [currentDirection, setCurrentDirection] = useState<Direction>(Direction.Right);
    const [currentLocation, setCurrentLocation] = useState<Coordinate>([0, 0]);
    const [snakeQueue, setSnakeQueue] = useState<Array<number>>([0]);
    const movementInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const ROWS: number = 25;
    const COLS: number = 25;
    const ON_COLOR: string = 'black';
    const OFF_COLOR: string = 'rgb(30 41 59 / var(--tw-bg-opacity))';
    const FOOD_COLOR: string = 'green';

    /**
     * Performs a direction change when the user presses down on one 
     * of the arrow keys.
     * @param event 
     */
    // const onArrowKeyDown = useCallback((event: any) => {
    //     const key = event.key;

    //     switch(key) {
    //         case 'ArrowUp':
    //             setCurrentDirection(Direction.Up);
    //             break;
    //         case 'ArrowDown':
    //             setCurrentDirection(Direction.Down);
    //             break;
    //         case 'ArrowLeft':
    //             setCurrentDirection(Direction.Left);
    //             break;
    //         case 'ArrowRight':
    //             setCurrentDirection(Direction.Right);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [Direction])

    // const moveSnake = useCallback(() => {
    //     switch (currentDirection) {
    //         case Direction.Up:
    //             if (currentLocation.row > 0) {
    //                 setCurrentLocation((prev: Coordinate) => {
    //                     return {
    //                         ...prev,
    //                         row: prev.row - 1,
    //                     }
    //                 });
    //             }
    //             break;
    //         case Direction.Down:
    //             if (currentLocation.row < ROWS - 1) {
    //                 setCurrentLocation((prev: Coordinate) => {
    //                     return {
    //                         ...prev,
    //                         row: prev.row + 1,
    //                     }
    //                 });
    //             }
    //             break;
    //         case Direction.Left:
    //             if (currentLocation.col > 0) {
    //                 setCurrentLocation((prev: Coordinate) => {
    //                     return {
    //                         ...prev,
    //                         col: prev.col - 1,
    //                     }
    //                 });
    //             }
    //             break;
    //         case Direction.Right:
    //             if (currentLocation.col < COLS - 1) {
    //                 let tail = document.getElementById(`cell-${snakeQueue[0]}`);
    //                 if (tail) tail.style.backgroundColor = 'white';
    //                 setCurrentLocation((prev: Coordinate) => {
    //                     return {
    //                         ...prev,
    //                         col: prev.col + 1,
    //                     }
    //                 });
    //             }
    //             else {
    //                 console.log("Game over");
                    
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }, [Direction, currentDirection, currentLocation])

    /**
     * Returns the number of the cell represented by the given coordinate row and column.
     * Example: {row: 1, col: 0} => ROWS * 1 + 0
     * @param {Coordinate} location
     */
    function getCellIdFromCoordinates (location: Coordinate): number {
        return (location[0] * ROWS + location[1]);
    }
  
    // useEffect(() => {
    //     // Adds a keydown event listener to the document when the component mounts and
    //     // removes it when the component unmounts. 
    //     document.addEventListener('keydown', onArrowKeyDown);

    //     // Sets the initial character position on the screen when the component mounts
    //     let startingCell = document.getElementById(`cell-${getCellFromCoordinates({row: 0, col: 0})}`);
    //     if (startingCell) startingCell.style.backgroundColor = 'black';

    //     return () => {
    //         document.removeEventListener('keydown', onArrowKeyDown);
    //     }
    // }, [onArrowKeyDown, getCellFromCoordinates, moveSnake])

    // useEffect(() => {
    //     // Set an interval to make the snake move.
    //     movementInterval.current = setInterval(moveSnake, 500);
    //     console.log('interval set')

    //     return () => {
    //         clearInterval(movementInterval.current as NodeJS.Timeout);
    //     }
    // }, [moveSnake])

    // // Updates the cell corresponding to each location update.
    // useEffect(() => {
    //     console.log(currentLocation);
    //     let cell = document.getElementById(`cell-${getCellFromCoordinates(currentLocation)}`);
    //     if (cell) cell.style.backgroundColor = 'black';
    // }, [currentLocation, getCellFromCoordinates])

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
        board[foodCoordinate[0]][foodCoordinate[1]] = 2;
        
        // Set cell to food color
        const id = getCellIdFromCoordinates(foodCoordinate);
        const cell = document.getElementById(`cell-${id}`);
        if (cell) {
            cell.style.backgroundColor = FOOD_COLOR;
        }

        return foodCoordinate;
    }

    /**
     * Returns the resulting coordinate by moving one step in the given direction
     * beginning at the starting coordinate.
     * @param {Coordinate} start 
     * @param {Direction} direction 
     * @returns {Coordinate}
     */
    function move(start: Coordinate, direction: Direction = Direction.Right): Coordinate {
        let newLocation = {...start};
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

    function playGame() {
        const startRow = 0;
        const startCol = 0;
        // Snake properties
        let head: Coordinate = [startRow, startCol];
        let snakeCoords: Coordinate[] = [head];

        // Board
        const board: number[][] = [];
        for (let i = 0; i < ROWS; i++) {
            board.push(new Array());
            for (let j = 0; j < COLS; j++) {
                board[i].push(0);
            }
        }
        board[startRow][startCol] = 1;

        placeFood(board);
        enableCell(head);
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

        // Movement interval
        let interval = setInterval(() => {
            head = move(head, currDirection);
            const headRow = head[0];
            const headCol = head[1];

            // Check for intersection
            if (board[headRow][headCol] === 1) {
                console.log("Game over");
                clearInterval(interval);
            }

            snakeCoords.push(head);

            // Remove old tail after the move if no food was eaten
            if (board[headRow][headCol] === 2) {
                placeFood(board);
            }
            else {
                if (snakeCoords.length > 1) disableCell(snakeCoords[0]);
                board[snakeCoords[0][0]][snakeCoords[0][1]] = 0;
                snakeCoords = snakeCoords.slice(1);
            }
            
            if (head[0] < ROWS && head[0] >= 0 && head[1] < COLS && head[1]>= 0) {
                enableCell(head);
                board[headRow][headCol] = 1;
            }
            else {
                console.log("Game over");
                clearInterval(interval);
            }
        }, 500);

    }


    return (
        <section>
            <div className="grid grid-rows-25 grid-cols-25 min-w-game-width min-h-game-height bg-slate-800">
                {[...Array(ROWS * COLS)].map((value: undefined, i: number) =>
                    <div
                        key={`pixel-${i}`}
                        id={`cell-${i}`}
                        className="w-full h-full"
                    />
                )}
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