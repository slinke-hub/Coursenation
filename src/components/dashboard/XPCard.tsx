import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"

interface XPCardProps {
    xp: number
    label?: string
}

export function XPCard({ xp, label = "Total XP" }: XPCardProps) {
    return (
        <Card className="border-border bg-card">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold text-primary">{xp.toLocaleString()} XP</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                </div>
            </CardContent>
        </Card>
    )
}
