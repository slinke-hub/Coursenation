import { Button } from "@/components/ui/button"
import { AnnouncementsWidget } from "@/components/dashboard/AnnouncementsWidget"

export default function TeacherDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
                <Button>Create New Course</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Announcements Widget */}
                <div className="lg:col-span-1">
                    <AnnouncementsWidget />
                </div>

                {/* Placeholder for future widgets */}
                <div className="lg:col-span-2 p-4 border rounded-lg bg-card/50">
                    <p className="text-muted-foreground">Analytics graph placeholder...</p>
                </div>
            </div>
        </div>
    )
}
