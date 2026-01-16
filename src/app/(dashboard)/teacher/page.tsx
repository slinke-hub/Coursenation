import { Button } from "@/components/ui/button"

export default function TeacherDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
                <Button>Create New Course</Button>
            </div>
            <div className="p-4 border rounded-lg bg-card/50">
                <p className="text-muted-foreground">Analytics graph placeholder...</p>
            </div>
        </div>
    )
}
