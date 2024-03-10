import GameStats from "../../components/GameStats";
import { MinesweeperScore, SnakeScore, FriendRequest } from "../../types";
import { getFriendRequests, getMinesweeperScores, getSnakeScores } from "@/src/lib/actions";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import FriendRequestEntry from "@/app/components/FriendRequestEntry";
import { auth } from "@/auth";

export default async function Dashboard({ params }: { params: { username: string } }) {
    const session = await auth();

    let minesweeperScores: MinesweeperScore[] = []; 
    let snakeScores: SnakeScore[] = []; 
    const friendRequests: FriendRequest[] = (await getFriendRequests(params.username)).data;

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

            {/* If loggin in user is the owner of the account displayed */}
            {session?.user?.name === params.username && <div>
                {friendRequests.length > 0 && <div>
                    <h2>Friend Requests</h2>
                    {friendRequests.map((req: FriendRequest) => <FriendRequestEntry key={req.id} request={req} />)}
                </div>}
                <Link href="/addFriend">Add a Friend</Link>
            </div>}
        </main>
    )
}
