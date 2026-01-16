import { Leaderboard } from "@/components/dashboard/Leaderboard"

export default function LeaderboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">Global Leaderboard</h1>
            <p className="text-muted-foreground">See how you stack up against other learners!</p>

            <div className="max-w-2xl">
                <Leaderboard />
            </div>
        </div>
    )
}
