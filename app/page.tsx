import { signOut } from "@/auth";
import Link from "next/link"
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      
      <div>
        <h1 className='text-5xl font-bold'>Welcome to Pixel Arcade!</h1>
      </div>

      <div className='text-center flex flex-col gap-4 content-center justify-center'>
        {session && <Link
          href="/dashboard" 
          className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
        >
          Dashboard
        </Link>}

        {/* Game Links */}
        <Link 
          href="/games/snake"
          className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
        >
          <h2>Snake</h2>
        </Link>
        <Link
          href="/games/minesweeper"
          className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
        >
          <h2>MineSweeper</h2>
        </Link>
        <Link
          href="/games/tetris"
          className='text-3xl font-semibold py-4 cursor-pointer transition-all hover:font-bold'
        >
          <h2>Tetris</h2>
        </Link>

        {/* Login/Logout */}
        {!session && <Link href="/login">Login</Link>}
        {session && 
          <form action={async () => {
            'use server';
            await signOut();
          }}>
            <button type='submit'>Sign out</button>
          </form>
        }
      </div>
    </main>
  )
}
