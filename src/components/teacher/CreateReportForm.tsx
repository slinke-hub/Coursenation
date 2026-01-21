"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDailyReport } from "@/actions/reports"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Student {
    id: string
    username: string
    avatar_url: string | null
}

interface CreateReportFormProps {
    students: Student[]
}

export function CreateReportForm({ students }: CreateReportFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        const result = await createDailyReport(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Report created successfully")
            router.push("/teacher/reports") // Redirect or refresh
            router.refresh()
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create Daily Report</CardTitle>
                <CardDescription>Send a progress update to your student.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="studentId">Student</Label>
                            <Select name="studentId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.username || "Unknown"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                type="date"
                                id="date"
                                name="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="isPaid" name="isPaid" />
                        <Label htmlFor="isPaid">Class Paid?</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pointOfFocus">Point of Focus</Label>
                        <Textarea
                            id="pointOfFocus"
                            name="pointOfFocus"
                            placeholder="What did we focus on today?"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newWords">New Words / Vocabulary</Label>
                        <Textarea
                            id="newWords"
                            name="newWords"
                            placeholder="List new words learned..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="homework">Homework</Label>
                        <Textarea
                            id="homework"
                            name="homework"
                            placeholder="Assignments for next class..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="upcomingClass">Upcoming Class Topic / Date</Label>
                        <Input
                            id="upcomingClass"
                            name="upcomingClass"
                            placeholder="Next class topic or time"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Report
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
