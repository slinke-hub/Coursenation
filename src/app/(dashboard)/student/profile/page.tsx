import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap, Trophy, Medal, Star, Target, CalendarDays } from "lucide-react"
import { XPChart } from "@/components/profile/XPChart"

async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return { ...profile, email: user.email }
}

export default async function ProfilePage() {
    const profile = await getProfile()

    if (!profile) return <div>Please log in</div>

    // Calculate Level
    const currentXP = profile.xp || 0
    const level = Math.floor(currentXP / 100) + 1
    const progressToNextLevel = (currentXP % 100)

    // Mock Badges Logic
    const badges = [
        { id: '1', name: 'Early Bird', icon: Star, description: 'Joined in Alpha', earned: true },
        { id: '2', name: 'On Fire', icon: Flame, description: '3 Day Streak', earned: (profile.streak || 0) >= 3 },
        { id: '3', name: 'Scholar', icon: Trophy, description: 'Earned 100 XP', earned: currentXP >= 100 },
        { id: '4', name: 'Legend', icon: Medal, description: 'Earned 1000 XP', earned: currentXP >= 1000 },
        { id: '5', name: 'Committed', icon: Target, description: '7 Day Streak', earned: (profile.streak || 0) >= 7 },
        { id: '6', name: 'Speedster', icon: Zap, description: 'Complete a Speed Round', earned: false },
    ]

    // Mock XP History
    const xpHistory = [
        { day: 'Mon', xp: Math.floor(Math.random() * 50) },
        { day: 'Tue', xp: Math.floor(Math.random() * 50) + 20 },
        { day: 'Wed', xp: Math.floor(Math.random() * 50) + 10 },
        { day: 'Thu', xp: Math.floor(Math.random() * 50) + 30 },
        { day: 'Fri', xp: Math.floor(Math.random() * 50) + 40 },
        { day: 'Sat', xp: Math.floor(Math.random() * 80) + 20 },
        { day: 'Sun', xp: Math.floor(Math.random() * 60) + 10 },
    ]

    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">

            {/* Header / Identity */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card border border-border rounded-xl shadow-sm">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {profile.username?.substring(0, 2).toUpperCase() || 'LQ'}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold">{profile.username || 'Learner'}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge variant="secondary" className="px-3 py-1">Level {level}</Badge>
                        <Badge variant="outline" className="px-3 py-1 capitalize">{profile.role}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground ml-auto bg-muted px-2 py-1 rounded">
                            <CalendarDays className="mr-2 h-3 w-3" />
                            Joined {joinDate}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentXP}</div>
                        <Progress value={progressToNextLevel} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {100 - progressToNextLevel} XP to Level {level + 1}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.streak || 0} Days</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Daily practice makes perfect.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Badges</CardTitle>
                        <Trophy className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{badges.filter(b => b.earned).length} / {badges.length}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Collect them all!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rank</CardTitle>
                        <Medal className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Top 10%</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Among all students
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Chart */}
            <XPChart data={xpHistory} />

            {/* Badges Gallery */}
            <div>
                <h2 className="text-xl font-bold mb-4">Achievements</h2>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {badges.map((badge) => (
                        <Card key={badge.id} className={`border-2 transition-all ${badge.earned ? 'border-primary/50 bg-primary/5' : 'border-dashed opacity-50 grayscale'}`}>
                            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center h-full">
                                <div className={`p-3 rounded-full ${badge.earned ? 'bg-background shadow-inner' : 'bg-muted'}`}>
                                    <badge.icon className={`h-8 w-8 ${badge.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div>
                                    <div className="font-bold">{badge.name}</div>
                                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

