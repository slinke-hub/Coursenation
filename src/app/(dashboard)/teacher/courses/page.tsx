import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function TeacherCoursesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Unauthorized</div>

    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">My Courses</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses?.map((course) => (
                    <Link key={course.id} href={`/teacher/courses/${course.id}/edit`}>
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {course.description || 'No description provided.'}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${course.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {course.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {(!courses || courses.length === 0) && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        No courses found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    )
}
