'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGamification } from "@/hooks/useGamification"
import { StreakCounter } from "@/components/dashboard/StreakCounter"
import { XPCard } from "@/components/dashboard/XPCard"
import { awardXP } from "@/actions/gamification"
import { Button } from "@/components/ui/button"
import { AnnouncementsWidget } from "@/components/dashboard/AnnouncementsWidget"

export default function StudentDashboard() {
    const { xp, streak } = useGamification()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Student Dashboard</h1>
                <Button variant="outline" onClick={() => awardXP(10)}>Dev: Add 10 XP</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnnouncementsWidget />
                <XPCard xp={xp} />
                <StreakCounter streak={streak} isActive={streak > 0} />
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Course Progress</h2>
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">Spanish Basics</span>
                            <span className="text-muted-foreground">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
