'use client';

import { minesweeperImages } from "@/src/assets/minesweeperImages"
import Image from "next/image"
import { useEffect, useState } from "react";
import { State } from "../testing/utils";

export default function MinesweeperCell(props: any) {
    const { value, state, clearCell, row, col, flagCell } = props;
    const [visible, setVisible] = useState<boolean>(state === State.Visible);

    function handleClick() {
        if (visible || state === State.Flagged) return;
        clearCell(row, col);
    }
    
    function handleRightClick() {
        if (visible) return;
        flagCell(row, col);
    }

    useEffect(() => {
        setVisible(state === State.Visible)
    }, [state]);

    return (
        <div className="relative w-full h-full select-none" onClick={handleClick} onContextMenu={handleRightClick}>
            <Image 
                src={minesweeperImages.empty} 
                fill={true} alt="Minesweeper empty cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />
            {!visible && state === State.Covered && <Image 
                src={minesweeperImages.covered} 
                fill={true} alt="Minesweeper blank cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {!visible && state === State.Flagged && <Image 
                src={minesweeperImages.flag} 
                fill={true} alt="Minesweeper blank cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === -1 && props && <Image 
                src={minesweeperImages.mine} 
                fill={true} alt="Minesweeper mine cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 1 && props && <Image 
                src={minesweeperImages.one} 
                fill={true} alt="Minesweeper one cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 2 && <Image 
                src={minesweeperImages.two} 
                fill={true} alt="Minesweeper two cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 3 && <Image 
                src={minesweeperImages.three} 
                fill={true} alt="Minesweeper three cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 4 && <Image 
                src={minesweeperImages.four} 
                fill={true} alt="Minesweeper four cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 5 && <Image 
                src={minesweeperImages.five} 
                fill={true} alt="Minesweeper five cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 6 && <Image 
                src={minesweeperImages.six} 
                fill={true} alt="Minesweeper six cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 7 && <Image 
                src={minesweeperImages.seven} 
                fill={true} alt="Minesweeper seven cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            {visible && value === 8 && <Image 
                src={minesweeperImages.eight} 
                fill={true} alt="Minesweeper eight cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
        </div>
    )
}