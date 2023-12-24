import Game from "./Game"

export default function Minesweeper() {
    return (
        <main className="flex h-screen min-h-screen flex-col items-center px-24 py-12 gap-2">
            <div>
                <h1 className='text-5xl font-bold'>MineSweeper</h1>
            </div>
            <Game />
        </main>
    )
}