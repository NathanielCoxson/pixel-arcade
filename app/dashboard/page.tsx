import { auth } from "@/auth";
import MinesweeperScores from "../components/MinesweeperScores";
import SnakeScores from "../components/SnakeScores";

export default async function Dashboard() {
    const session = await auth();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24 gap-2">
            <h1 className="text-xl font-bold">Hello {session?.user?.name}</h1>
            <SnakeScores />
            <MinesweeperScores />
        </main>
    )
}