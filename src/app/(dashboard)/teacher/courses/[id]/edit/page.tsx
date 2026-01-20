'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, GripVertical, Trash2 } from 'lucide-react'
import { getCourse, createModule, updateModule, deleteModule, createLesson, updateCourseDetails } from "@/actions/courses"
import { useRouter } from 'next/navigation'

export default function CourseEditorPage({ params }: { params: { id: string } }) {
    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadCourse()
    }, [])

    async function loadCourse() {
        const data = await getCourse(params.id)
        setCourse(data)
        setLoading(false)
    }

    async function handleSaveDetails() {
        if (!course) return
        await updateCourseDetails(course.id, {
            title: course.title,
            description: course.description,
            published: course.published
        })
        alert('Details saved!')
    }

    async function handleAddModule() {
        const title = prompt("Module Title:")
        if (title) {
            await createModule(course.id, title, (course.modules?.length || 0))
            loadCourse()
        }
    }

    async function handleAddLesson(moduleId: string) {
        const title = prompt("Lesson Title:")
        if (title) {
            const module = course.modules.find((m: any) => m.id === moduleId)
            await createLesson(moduleId, course.id, title, (module.lessons?.length || 0))
            loadCourse()
        }
    }

    async function handleDeleteModule(moduleId: string) {
        if (confirm("Delete this module and all its lessons?")) {
            await deleteModule(moduleId, course.id)
            loadCourse()
        }
    }

    if (loading) return <div>Loading course data...</div>
    if (!course) return <div>Course not found</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Edit Course</h1>
                    <p className="text-muted-foreground">ID: {params.id}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={async () => {
                            await updateCourseDetails(course.id, { published: !course.published })
                            loadCourse()
                        }}
                    >
                        {course.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button onClick={handleSaveDetails}><Save className="mr-2 h-4 w-4" /> Save Details</Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={course.title}
                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={course.description || ''}
                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Curriculum</h2>
                        <Button variant="secondary" size="sm" onClick={handleAddModule}>
                            <Plus className="mr-2 h-4 w-4" /> Add Module
                        </Button>
                    </div>

                    {course.modules?.map((module: any) => (
                        <Card key={module.id} className="border-l-4 border-l-primary">
                            <CardHeader className="py-4 flex flex-row items-center gap-4 space-y-0">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                <div className="font-semibold text-lg">{module.title}</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteModule(module.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="pl-12 space-y-2">
                                {module.lessons?.map((lesson: any) => (
                                    <div key={lesson.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded border group">
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                        <span className="text-sm font-medium">{lesson.title}</span>
                                        <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs opacity-0 group-hover:opacity-100">Edit</Button>
                                    </div>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full border-dashed border text-muted-foreground hover:text-primary"
                                    onClick={() => handleAddLesson(module.id)}
                                >
                                    <Plus className="mr-2 h-3 w-3" /> Add Lesson
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                            No modules yet. Click "Add Module" to start building your curriculum.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
