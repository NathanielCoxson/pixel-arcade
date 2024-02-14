import BackButton from "@/app/components/BackButton"
import Game from "./Game"

export default async function Minesweeper() {
    return (
        <main className="flex h-screen min-h-screen w-full flex-col items-center lg:px-24 px-10 py-12 gap-2">
            <BackButton />
            <div>
                <h1 className='text-5xl font-bold'>MineSweeper</h1>
            </div>
            
            <Game />
        </main>
    )
}