import { auth } from "@/auth";
import { SnakeScore } from "../types";

//export default async function SnakeScores() {
//    const session = await auth();
//    let scores: MinesweeperScore[] = [];
//    if (session?.user) {
//        scores = await getMinesweeperScores(session.user.id);
//        scores = scores.sort((a: MinesweeperScore, b: MinesweeperScore) => {
//            if (a.time <= b.time) return -1;
//            else return 1;
//        });
//    }
//
//    return (
//        <div className="px-4 max-h-40 overflow-auto">
//            <ul>
//                {scores?.map((score: MinesweeperScore) => {
//                    const day = score.timestamp.getDate();
//                    const month = score.timestamp.getMonth() + 1;
//                    const year = score.timestamp.getFullYear();
//
//                    // Convert time in seconds to HH-MM-SS
//                    const time = new Date(score.time * 1000).toISOString().slice(11, 19);
//                    return <li key={score.id}>{time} on {month}/{day}/{year}</li>
//                })}
//            </ul>
//        </div>
//    )
//}