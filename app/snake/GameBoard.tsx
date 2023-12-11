'use client'

import { useCallback, useEffect, useState } from "react";

export default function GameBoard() {
    enum Direction {
        Up,
        Down,
        Left,
        Right,
    }
    type Coordinate = {
        row: number,
        col: number,
    }
 
    const [currentDirection, setCurrentDirection] = useState<Direction>(Direction.Right);
    const [currentLocation, setCurrentLocation] = useState<Coordinate>({row: 0, col: 0});
    const ROWS: number = 25;
    const COLS: number = 25;

    function onPixelClick(event: any) {
        const cellNumber: number = Number(event.target.id.slice(5));
        const col: number = cellNumber % COLS;
        const row: number = Math.floor(cellNumber / ROWS);

        event.target.style.backgroundColor = 'black';
    }

    /**
     * Performs a direction change when the user presses down on one 
     * of the arrow keys.
     * @param event 
     */
    const onArrowKeyDown = useCallback((event: any) => {
        const key = event.key;

        switch(key) {
            case 'ArrowUp':
                setCurrentDirection(Direction.Up);
                // Move up if possible
                if (currentLocation.row > 0) {
                    setCurrentLocation((prev: Coordinate) => {
                        return {
                            ...prev,
                            row: prev.row - 1,
                        }
                    });
                }
                break;
            case 'ArrowDown':
                setCurrentDirection(Direction.Down);
                // Move down if possible
                if (currentLocation.row < ROWS - 1) {
                    setCurrentLocation((prev: Coordinate) => {
                        return {
                            ...prev,
                            row: prev.row + 1,
                        }
                    });
                }
                break;
            case 'ArrowLeft':
                setCurrentDirection(Direction.Left);
                // Move down if possible
                if (currentLocation.col > 0) {
                    setCurrentLocation((prev: Coordinate) => {
                        return {
                            ...prev,
                            col: prev.col - 1,
                        }
                    });
                }
                break;
            case 'ArrowRight':
                setCurrentDirection(Direction.Right);
                // Move down if possible
                if (currentLocation.col < COLS - 1) {
                    setCurrentLocation((prev: Coordinate) => {
                        return {
                            ...prev,
                            col: prev.col + 1,
                        }
                    });
                }
                break;
            default:
                break;
        }
    }, [currentLocation, Direction])

    /**
     * Returns the number of the cell represented by the given coordinate row and column.
     * Example: {row: 1, col: 0} => ROWS * 1 + 0
     * @param {Coordinate} location
     */
    const getCellFromCoordinates = useCallback((location: Coordinate): number => {
        return (location.row * ROWS + location.col);
    }, [])

    useEffect(() => {
        // Adds a keydown event listener to the document when the component mounts and
        // removes it when the component unmounts. 
        document.addEventListener('keydown', onArrowKeyDown);

        // Sets the initial character position on the screen when the component mounts
        let startingCell = document.getElementById(`cell-${getCellFromCoordinates({row: 0, col: 0})}`);
        if (startingCell) startingCell.style.backgroundColor = 'black';

        return () => {
            document.removeEventListener('keydown', onArrowKeyDown);
        }
    }, [onArrowKeyDown, getCellFromCoordinates])

    useEffect(() => {
        console.log(currentLocation);
        let cell = document.getElementById(`cell-${getCellFromCoordinates(currentLocation)}`);
        if (cell) cell.style.backgroundColor = 'black';
    }, [currentLocation, getCellFromCoordinates])
    
    return (
        <section>
            <div className="grid grid-rows-25 grid-cols-25 min-w-game-width min-h-game-height bg-slate-800 rounded-md">
                {[...Array(ROWS * COLS)].map((value: undefined, i: number) =>
                    <div
                        key={`pixel-${i}`}
                        id={`cell-${i}`}
                        onClick={onPixelClick}
                        className="w-full h-full hover:bg-slate-400 cursor-pointer"
                    />
                )}
            </div>
            <div>
                {/* TODO Add controls here like reset etc, and add styling to make it appear more like a control bar*/}
                <h3 className="font-semibold">Controls:</h3>
            </div>
        </section>

    )
}