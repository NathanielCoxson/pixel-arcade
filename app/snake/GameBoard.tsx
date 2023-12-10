'use client'
export default function GameBoard() {
    const ROWS: number = 25;
    const COLS: number = 25;

    function onPixelClick(event: any) {
        const cellNumber: number = Number(event.target.id.slice(5));
        const col: number = cellNumber % COLS;
        const row: number = Math.floor(cellNumber / ROWS);

        event.target.style.backgroundColor = 'black';
    }

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