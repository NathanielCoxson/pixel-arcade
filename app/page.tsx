import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      
      <div>
        <h1 className='text-5xl font-bold'>Welcome to Pixel Arcade!</h1>
      </div>

      <div className='text-center flex flex-col gap-4 content-center justify-center'>
        <Link 
          href="/games/snake"
          className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
        >
          <h2>Snake</h2>
        </Link>
        <a className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'>
          <Link 
            href="/games/minesweeper"
            className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
          >
            <h2>MineSweeper</h2>
          </Link>
        </a>
        <a className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'>
          <h2>Tetris</h2>
        </a>
      </div>
    </main>
  )
}
