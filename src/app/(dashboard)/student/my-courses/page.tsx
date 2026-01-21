import { getEnrolledCourses } from "@/actions/courses"
import { CourseCard } from "@/components/dashboard/CourseCard"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default async function MyCoursesPage() {
    const courses = await getEnrolledCourses()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-primary">My Courses</h1>
                <p className="text-muted-foreground">Continue learning where you left off.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: any) => (
                    <Link key={course.id} href={`/student/courses/${course.id}`}>
                        <CourseCard
                            title={course.title}
                            description={course.description}
                            progress={course.progress} // This will show the progress bar
                            image={course.thumbnail_url || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2069&auto=format&fit=crop'}
                        />
                    </Link>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 bg-muted/20 border-2 border-dashed rounded-xl">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No courses enrolled yet</h3>
                        <p className="text-muted-foreground mb-6">Explore the catalog to find your next lesson!</p>
                        <Link href="/student/courses" className="text-primary hover:underline">
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
