'use client';

import { minesweeperImages } from "@/src/assets/minesweeperImages"
import Image from "next/image"
import { useState } from "react";

export default function MinesweeperCell(props: any) {
    const { value, updateBoard } = props;
    const [shown, setShown] = useState<boolean>(true);

    function handleClick() {
        setShown(prev => !prev);
        updateBoard(props.row, props.col);
    }

    return (
        <div className="relative w-full h-full select-none border-2 border-slate-400" onClick={handleClick}>
            {shown && value === 1 && props.visible === 0 && <Image 
                src={minesweeperImages.covered} 
                fill={true} alt="Minesweeper one cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {!shown && <Image 
                src={minesweeperImages.one} 
                fill={true} alt="Minesweeper one cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
        </div>
    )
}