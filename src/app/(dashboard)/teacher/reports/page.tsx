import { getTeacherReports } from "@/actions/reports"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Check, X } from "lucide-react"

export default async function ReportsPage() {
    const reports = await getTeacherReports()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Reports</h1>
                    <p className="text-muted-foreground">
                        History of reports sent to students.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/teacher/reports/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Report
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => (
                    <Card key={report.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between">
                                <span>{report.date}</span>
                                {report.is_paid ? (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                        <Check className="w-3 h-3 mr-1" /> Paid
                                    </span>
                                ) : (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                                        <X className="w-3 h-3 mr-1" /> Unpaid
                                    </span>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Student: <span className="font-medium text-foreground">{report.student?.username || 'Unknown'}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {report.point_of_focus && (
                                <div>
                                    <span className="font-semibold">Focus:</span> {report.point_of_focus.substring(0, 50)}...
                                </div>
                            )}
                            {report.homework && (
                                <div>
                                    <span className="font-semibold">Homework:</span> {report.homework.substring(0, 50)}...
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {reports.length === 0 && (
                    <div className="col-span-full text-center p-8 text-muted-foreground bg-muted/50 rounded-lg">
                        No reports created yet.
                    </div>
                )}
            </div>
        </div>
    )
}
