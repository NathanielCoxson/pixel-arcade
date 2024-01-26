import { auth } from "@/auth";
import { MinesweeperScore } from "../types";
import { getMinesweeperScores } from "@/src/lib/actions";
import PieChart from "./PieChart";

export default async function MinesweeperScores() {
    const MAX_HIGH_SCORES = 5;
    const session = await auth();
    let scores: MinesweeperScore[] = [];
    if (session?.user) {
        scores = await getMinesweeperScores(session.user.id);
        scores = scores.sort((a: MinesweeperScore, b: MinesweeperScore) => {
            if (a.time <= b.time) return -1;
            else return 1;
        });
    }

    /**
     * Returns an object containing the numerical parts of a date including
     * day, month, and year. 
     * @param {Date} timestamp 
     * @returns { day: number, month: number, year: number }
     */
    function getDateParts(timestamp: Date): { day: number, month: number, year: number } {
        const day = timestamp.getDate();
        const month = timestamp.getMonth() + 1;
        const year = timestamp.getFullYear();
        return { day, month, year };
    }

    /**
     * Returns a time string in the format: HH-MM-SS given a number of seconds. 
     * @param {number} seconds 
     * @returns {string}
     */
    function getFormattedSeconds(seconds: number): string {
        return new Date(seconds * 1000).toISOString().slice(11, 19);
    }

    return (
        <div className="p-4 rounded-lg bg-gradient-to-br from-black to-slate-800 text-white">
            <div className="text-left font-bold">
                <h1 className="text-xl">Minesweeper</h1>
                <h2>{session?.user?.name}</h2>
            </div>
            <div className="flex justify-center items-center gap-8">
                <div className="text-left">
                    <h2>Wins: {scores?.filter((score: MinesweeperScore) => score.win).length}</h2>
                    <h2>Losses: {scores?.filter((score: MinesweeperScore) => !score.win).length}</h2>
                    <h2>Best Time: 00:01:12</h2>
                </div>
                {/*<PieChart wins={10} losses={20}/>*/}
                <div>
                    <h2 className="font-bold">High Scores</h2>
                    {scores?.filter((score: MinesweeperScore) => score.win).slice(0, MAX_HIGH_SCORES).map((score: MinesweeperScore) => {
                        const { day, month, year } = getDateParts(score.timestamp);
                        const time = getFormattedSeconds(score.time);
                        return <h2 key={score.id}>{time} on {month}/{day}/{year}</h2>;
                    })}
                </div>
            </div>
        </div>
    )
}