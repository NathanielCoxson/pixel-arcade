'use client'

import { useEffect, useState } from "react";

export default function Game() {
    const ROWS = 10;
    const COLS = 10;
    const [board, setBoard] = useState<number[][]>([[]]);

    useEffect(() => {
        let arr = [];
        for (let i = 0; i < ROWS; i++) {
            let column = [];
            for (let j = 0; j < COLS; j++) {
                column.push(0);
            }
            arr.push(column);
        }
        setBoard(arr);
        console.log(arr);
    }, []);

    function onCellMouseOver(event: any) {
        event.target.style.backgroundColor = 'black';
    }

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