import { getStudentsForTeacher } from "@/actions/reports"
import { CreateReportForm } from "@/components/teacher/CreateReportForm"

export default async function CreateReportPage() {
    const students = await getStudentsForTeacher()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Report</h1>
                <p className="text-muted-foreground">
                    Create a daily report for a student.
                </p>
            </div>
            <CreateReportForm students={students} />
        </div>
    )
}
