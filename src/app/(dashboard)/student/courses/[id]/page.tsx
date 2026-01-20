'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, PlayCircle, Lock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { awardXP } from "@/actions/gamification"

// Mock Course Data
const courseData = {
    id: '1',
    title: 'Spanish Basics: Hola World',
    modules: [
        {
            id: 'm1',
            title: 'Module 1: Greetings',
            lessons: [
                { id: 'l1', title: 'Hola & Adios', duration: '5:00', locked: false, videoId: 'dQw4w9WgXcQ' }, // Rick roll for placeholder :)
                { id: 'l2', title: 'Asking "How are you?"', duration: '8:30', locked: false, videoId: 'KDxJlW6cxRk' },
                { id: 'l3', title: 'Introductions', duration: '12:00', locked: true },
            ]
        },
        {
            id: 'm2',
            title: 'Module 2: Numbers',
            lessons: [
                { id: 'l4', title: 'Numbers 1-10', duration: '6:00', locked: true },
                { id: 'l5', title: 'Numbers 11-100', duration: '15:00', locked: true },
            ]
        }
    ]
}

export default function CoursePlayerPage() {
    const params = useParams()
    const [activeLesson, setActiveLesson] = useState(courseData.modules[0].lessons[0])
    const [completedLessons, setCompletedLessons] = useState<string[]>([])

    const handleLessonSelect = (lesson: any) => {
        if (!lesson.locked) {
            setActiveLesson(lesson)
        }
    }

    const markComplete = async () => {
        if (!completedLessons.includes(activeLesson.id)) {
            setCompletedLessons([...completedLessons, activeLesson.id])
            await awardXP(20) // Award XP for finishing a lesson
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-theme(spacing.24))] gap-6">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border/50 shadow-2xl">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${activeLesson.videoId || 'dQw4w9WgXcQ'}?autoplay=0`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{activeLesson.title}</h1>
                        <p className="text-muted-foreground">{courseData.title}</p>
                    </div>
                    <Button
                        size="lg"
                        onClick={markComplete}
                        disabled={completedLessons.includes(activeLesson.id)}
                        className={completedLessons.includes(activeLesson.id) ? "bg-green-600/20 text-green-500 hover:bg-green-600/30" : ""}
                    >
                        {completedLessons.includes(activeLesson.id) ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Completed</>
                        ) : (
                            "Mark Complete (+20 XP)"
                        )}
                    </Button>
                </div>

                <Card className="flex-1 border-border bg-card">
                    <CardHeader>
                        <CardTitle>Lesson Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="w-full h-full min-h-[100px] bg-transparent resize-none focus:outline-none text-muted-foreground placeholder:text-muted-foreground/50"
                            placeholder="Type your notes here..."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar Modules */}
            <Card className="w-full lg:w-80 border-border bg-card/50 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {courseData.modules.map((module) => (
                            <div key={module.id} className="space-y-2">
                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider pl-2">
                                    {module.title}
                                </h3>
                                <div className="space-y-1">
                                    {module.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => handleLessonSelect(lesson)}
                                            disabled={lesson.locked}
                                            className={`w-full flex items-center justify-between p-3 rounded-md text-sm transition-colors text-left
                                                ${activeLesson.id === lesson.id
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-secondary/50 text-muted-foreground"}
                                                ${lesson.locked ? "opacity-50 cursor-not-allowed" : ""}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                {lesson.locked ? <Lock className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                                <span className="line-clamp-1">{lesson.title}</span>
                                            </div>
                                            <span className="text-xs opacity-70">{lesson.duration}</span>
                                        </button>
                                    ))}
                                </div>
                                <Separator className="my-2 opacity-50" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    )
}
