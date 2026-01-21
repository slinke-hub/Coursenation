import { AttendanceManager } from "@/components/teacher/AttendanceManager"
import { getTeacherCourses } from "@/actions/teacher"
import { ClipboardCheck } from "lucide-react"

export default async function AttendancePage() {
    const courses = await getTeacherCourses()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <ClipboardCheck className="h-8 w-8" />
                Attendance
            </h1>
            <AttendanceManager courses={courses || []} />
        </div>
    )
}
