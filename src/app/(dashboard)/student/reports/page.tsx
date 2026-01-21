import { getStudentReports } from "@/actions/reports"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Calendar, BookOpen, PenTool, Clock } from "lucide-react"

export default async function StudentReportsPage() {
    const reports = await getStudentReports()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Daily Reports</h1>
                <p className="text-muted-foreground">
                    Feedback and progress updates from your teacher.
                </p>
            </div>

            <div className="space-y-6">
                {reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        {new Date(report.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </CardTitle>
                                    <CardDescription>
                                        Instructor: {report.instructor?.username || 'Unknown'}
                                    </CardDescription>
                                </div>
                                <div>
                                    {report.is_paid ? (
                                        <div className="flex items-center text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                            <Check className="w-4 h-4 mr-1" /> Class Paid
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                                            <X className="w-4 h-4 mr-1" /> Payment Pending
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                            {report.point_of_focus && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2 text-primary">
                                        <BookOpen className="h-4 w-4" /> Point of Focus
                                    </h3>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                                        {report.point_of_focus}
                                    </p>
                                </div>
                            )}

                            {report.new_words && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2 text-primary">
                                        <PenTool className="h-4 w-4" /> New Words & Vocabulary
                                    </h3>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap bg-muted/50 p-3 rounded-md font-mono">
                                        {report.new_words}
                                    </p>
                                </div>
                            )}

                            {report.homework && (
                                <div className="space-y-2 md:col-span-2">
                                    <h3 className="font-semibold flex items-center gap-2 text-primary border-t pt-4 mt-2">
                                        <div className="bg-primary/10 p-1 rounded">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        Homework Assignment
                                    </h3>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                                        {report.homework}
                                    </p>
                                </div>
                            )}

                            {report.upcoming_class && (
                                <div className="space-y-2 md:col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10">
                                    <h3 className="font-semibold flex items-center gap-2 text-primary">
                                        <Clock className="h-4 w-4" /> Upcoming Class
                                    </h3>
                                    <p className="text-sm text-foreground/90 font-medium">
                                        {report.upcoming_class}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {reports.length === 0 && (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No reports yet</h3>
                        <p>Your teacher hasn't posted any daily reports.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
