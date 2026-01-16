'use client'
import { Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
    streak: number
    isActive?: boolean
}

export function StreakCounter({ streak, isActive = true }: StreakCounterProps) {
    return (
        <Card className={cn(
            "border-border bg-card transition-all duration-500",
            isActive ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : ""
        )}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Streak</span>
                    <span className={cn(
                        "text-2xl font-black",
                        isActive ? "text-orange-500" : "text-muted-foreground"
                    )}>
                        {streak} <span className="text-sm font-normal text-muted-foreground">Days</span>
                    </span>
                </div>
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-700",
                    isActive ? "bg-orange-500 text-white animate-pulse" : "bg-muted text-muted-foreground"
                )}>
                    <Flame className={cn("h-6 w-6", isActive && "fill-current")} />
                </div>
            </CardContent>
        </Card>
    )
}
