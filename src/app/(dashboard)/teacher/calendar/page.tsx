import { CalendarManager } from "@/components/teacher/CalendarManager"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                Calendar
            </h1>
            <CalendarManager />
        </div>
    )
}
