import GameBoard from "./GameBoard"

export default function Snake() {
    return (
        <main className="flex h-screen min-h-screen flex-col items-center p-24 gap-2">
            <div>
                <h1 className='text-5xl font-bold'>Snake</h1>
            </div>

            <GameBoard />
        </main>
    )
}