import { auth } from "@/auth";
import { SnakeScore } from "../types";
import { getSnakeScores } from "@/src/lib/actions";

export default async function SnakeScores() {
    const session = await auth();
    let scores: SnakeScore[] = [];
    if (session?.user) {
        scores = await getSnakeScores(session.user.id);
        scores = scores.sort((a: SnakeScore, b: SnakeScore) => {
            if (a.score >= b.score) return -1;
            else return 1;
        });
    }

    return (
        <div className="flex flex-col justify-center items-center text-center px-4 max-h-40 overflow-auto">
            {scores?.length > 0 && <h2 className="font-bold">Snake</h2>}
            <ul>
                {scores?.map((score: SnakeScore) => {
                    const day = score.timestamp.getDate();
                    const month = score.timestamp.getMonth() + 1;
                    const year = score.timestamp.getFullYear();

                    return <li key={score.id}>{score.score} points on {month}/{day}/{year}</li>
                })}
            </ul>
        </div>
    )
}