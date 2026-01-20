'use client'

import { CourseCard } from "@/components/dashboard/CourseCard"
import Link from "next/link"

// Mock Data
const courses = [
    {
        id: '1',
        title: 'Spanish Basics: Hola World',
        description: 'Start your journey with essential greetings and phrases.',
        progress: 45,
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'French for Travelers',
        description: 'Navigate Paris like a local. Order food, ask directions, and more.',
        progress: 10,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Business Japanese',
        description: 'Master the art of formal communication in the Japanese workplace.',
        progress: 0,
        image: 'https://images.unsplash.com/photo-1528360983277-13d9b152cace?q=80&w=2070&auto=format&fit=crop'
    }
]

export default function CoursesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-primary">Course Catalog</h1>
                <p className="text-muted-foreground">Pick a course and start your streak today!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => (
                    <Link key={course.id} href={`/student/courses/${course.id}`}>
                        <CourseCard
                            title={course.title}
                            description={course.description}
                            progress={course.progress}
                            image={course.image}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}
