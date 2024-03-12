import GameStats from "../../components/GameStats";
import { MinesweeperScore, SnakeScore } from "../../types";
import { getMinesweeperScores, getSnakeScores } from "@/src/lib/actions";
import BackButton from "../../components/BackButton";
import FriendRequestsPanel from "@/app/components/FriendRequestsPanel";
import { auth } from "@/auth"; 
import Link from "next/link";
import FriendsList from "@/app/components/FriendsList";

export default async function Dashboard({ params }: { params: { username: string } }) {
    const session = await auth();

    let minesweeperScores: MinesweeperScore[] = []; 
    let snakeScores: SnakeScore[] = []; 

    // Minesweeper information
    minesweeperScores = await getMinesweeperScores(params.username);
    minesweeperScores = minesweeperScores.sort((a: MinesweeperScore, b: MinesweeperScore) => {
        if (a.time <= b.time) return -1;
        else return 1;
    });

    // Snake information
    snakeScores = await getSnakeScores(params.username);
    snakeScores = snakeScores.sort((a: SnakeScore, b: SnakeScore) => {
        if (a.score >= b.score) return -1;
        else return 1;
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-center p-24 gap-4">
            <BackButton />
            <h1 className="text-4xl font-bold">Hello {params.username}</h1>
            <div className="w-fit flex flex-col gap-4">
                {minesweeperScores.length > 0 && <GameStats
                    user={params.username}
                    game='minesweeper'
                    scores={minesweeperScores}
                />}
                {snakeScores.length > 0 && <GameStats
                    user={params.username}
                    game='snake'
                    scores={snakeScores}
                />}
            </div>

            {session && session.user?.name == params.username && <div>
                <FriendRequestsPanel />
                <Link href="/addFriend">Add a friend</Link>
                <FriendsList />
            </div>}

        </main>
    )
}
