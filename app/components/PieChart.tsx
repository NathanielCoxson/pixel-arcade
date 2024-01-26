export default function PieChart(props: any) {
    const { wins, losses } = props;
    const winRate: string = String((Math.round((wins / (wins + losses)) * 100) % 10) * 10);
    
    return (
        <div className="h-40 w-40 rounded-full bg-gradient-conic from-green-400 from-30% via-green-400 via-30% to-red-400 to-30%"></div>
    )
}