'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getEnrolledStudents, getAttendance, saveAttendance } from "@/actions/teacher"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

interface Student {
    id: string
    username: string
    avatar_url?: string
}

interface Course {
    id: string
    title: string
}

export function AttendanceManager({ courses }: { courses: Course[] }) {
    const [selectedCourse, setSelectedCourse] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [students, setStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!selectedCourse) return

        async function fetchData() {
            setLoading(true)
            try {
                // 1. Get Students
                const studentsData = await getEnrolledStudents(selectedCourse)
                setStudents(studentsData)

                // 2. Get Existing Attendance
                const attendanceData = await getAttendance(selectedCourse, selectedDate)
                const recordMap: Record<string, string> = {}
                attendanceData.forEach((rec: any) => {
                    recordMap[rec.student_id] = rec.status
                })

                // Initialize defaults if not set? (Maybe 'present' by default?)
                // Let's leave them unset to force explicit taking, or map defaults.
                if (attendanceData.length === 0) {
                    const defaults: Record<string, string> = {}
                    studentsData.forEach((s: any) => defaults[s.id] = 'present')
                    setAttendance(defaults)
                } else {
                    setAttendance(recordMap)
                }

            } catch (err) {
                console.error(err)
                toast.error("Failed to load class data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedCourse, selectedDate])

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const records = Object.entries(attendance).map(([sid, status]) => ({
                student_id: sid,
                status
            }))

            const result = await saveAttendance(selectedCourse, selectedDate, records)
            if (result.success) {
                toast.success("Attendance saved successfully")
            } else {
                toast.error("Failed to save attendance")
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setSaving(false)
        }
    }

    // Sort students by name
    const sortedStudents = [...students].sort((a, b) => (a.username || '').localeCompare(b.username || ''))

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
                <div className="flex gap-4 items-end flex-wrap">
                    <div className="space-y-2 w-[250px]">
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[180px]"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!selectedCourse ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Please select a course to start taking attendance.
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No students found enrolled in this course.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-4">
                            {sortedStudents.map(student => (
                                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={student.avatar_url} />
                                            <AvatarFallback>{student.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{student.username}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                                            className={attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                            onClick={() => handleStatusChange(student.id, 'present')}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" /> Present
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                                            className={attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                                            onClick={() => handleStatusChange(student.id, 'absent')}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" /> Absent
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                                            className={attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                            onClick={() => handleStatusChange(student.id, 'late')}
                                        >
                                            <Clock className="h-4 w-4 mr-1" /> Late
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Attendance record
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
