'use client';

import { getImageSrc, images } from "@/src/assets/minesweeperImages"
import Image from "next/image"
import { useEffect, useState } from "react";
import { State } from "../games/minesweeper/utils";

export default function MinesweeperCell(props: any) {
    const { value, state, clearCell, row, col, flagCell } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [cellValue, setCellValue] = useState<number>(0);
    const [flagged, setFlagged] = useState<boolean>(false);

    function handleClick() {
        if (state === State.Flagged) return;
        clearCell(row, col);
    }
    
    function handleRightClick() {
        if (visible) return;
        flagCell(row, col);
    }

    useEffect(() => {
        setCellValue(value);
    }, [value]);

    useEffect(() => {
        switch(state) {
            case State.Visible:
                setVisible(true);
                setFlagged(false);
                break;
            case State.Covered:
                setVisible(false);
                setFlagged(false);
                break;
            case State.Flagged:
                setVisible(false);
                setFlagged(true); 
                break;
            default:
                break;
        }
    }, [state]);

    return (
        <div className="relative w-full h-full select-none" onClick={handleClick} onContextMenu={handleRightClick}>
            {/* Underlay blank cell that shows during transitions */}
            <Image 
                src={images.empty} 
                fill={true} alt="Minesweeper empty cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />
            
            {(!visible || typeof(cellValue) !== 'number') && <Image 
                src={images.covered} 
                fill={true} alt="Minesweeper empty cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}

            {flagged && <Image 
                src={images.flag} 
                fill={true} alt="Minesweeper empty cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
            
            {visible && typeof(cellValue) === 'number' && <Image 
                src={getImageSrc(cellValue)} 
                fill={true} alt="Minesweeper empty cell" 
                priority={true}
                onContextMenu={(e) => e.preventDefault()} 
                draggable={false}
            />}
        </div>
    )
}