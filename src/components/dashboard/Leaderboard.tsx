import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface LeaderboardUser {
    id: string
    username: string
    xp: number
    avatar_url?: string
}

// Mock data for now, will replace with real data fetch
const mockUsers: LeaderboardUser[] = [
    { id: '1', username: 'LingoMaster', xp: 2500, avatar_url: 'https://github.com/shadcn.png' },
    { id: '2', username: 'Polyglot', xp: 2100 },
    { id: '3', username: 'Novice', xp: 1200 },
]

export function Leaderboard() {
    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Learners
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50">
                            <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${index === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                    #{index + 1}
                                </span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.username}</span>
                            </div>
                            <span className="font-bold text-primary">{user.xp} XP</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
