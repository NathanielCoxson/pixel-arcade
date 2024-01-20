import { getMinesweeperScores } from "@/src/lib/actions"
import { auth } from "@/auth";

export default async function Dashboard() {
    const session = await auth();
    let scores;
    if (session?.user) {
        scores = await getMinesweeperScores(session.user.id);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-2">
            <h1 className="text-xl font-bold">Hello {session?.user?.name}</h1>
            <h2>Your Minesweeper Scores</h2>
            <ul>
                {scores?.map((score: { id: string, uid: string, time: number, numMines: number }) => {
                    return <li key={score.id}>{score.id}:{score.time}:{score.numMines}</li>
                })}
            </ul>
        </main>
    )
}