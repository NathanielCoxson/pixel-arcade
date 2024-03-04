import { auth } from "@/auth";
import GameStats from "../components/GameStats";
import { MinesweeperScore, SnakeScore } from "../types";
import { getMinesweeperScores, getSnakeScores } from "@/src/lib/actions";
import BackButton from "../components/BackButton";
import Link from "next/link";

export default async function Dashboard() {
    const session = await auth();
    let minesweeperScores: MinesweeperScore[] = []; 
    let snakeScores: SnakeScore[] = []; 

    if (session) {
        minesweeperScores = await getMinesweeperScores(session.user?.id);
        minesweeperScores = minesweeperScores.sort((a: MinesweeperScore, b: MinesweeperScore) => {
            if (a.time <= b.time) return -1;
            else return 1;
        });

        snakeScores = await getSnakeScores(session.user?.id);
        snakeScores = snakeScores.sort((a: SnakeScore, b: SnakeScore) => {
            if (a.score >= b.score) return -1;
            else return 1;
        });
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24 gap-4">
            <BackButton />
            <h1 className="text-4xl font-bold">Hello {session?.user?.name}</h1>
            {session && <div className="w-fit flex flex-col gap-4">
                <GameStats
                    user={session.user}
                    game='minesweeper'
                    scores={minesweeperScores}
                /> 
                <GameStats
                    user={session.user}
                    game='snake'
                    scores={snakeScores}
                /> 
            </div>}
            <Link href="/addFriend">Add a Friend</Link>
        </main>
    )
}
