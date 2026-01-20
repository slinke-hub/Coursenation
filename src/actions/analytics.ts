'use server'

import { createClient } from "@/utils/supabase/server"

export async function getTeacherAnalytics() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    // 1. Fetch teacher's courses
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, published')
        .eq('instructor_id', user.id)

    if (coursesError) throw new Error(coursesError.message)
    if (!courses || courses.length === 0) {
        return {
            totalStudents: 0,
            activeCourses: 0,
            avgCompletion: 0,
            enrollmentData: [],
            recentActivity: []
        }
    }

    const courseIds = courses.map(c => c.id)

    // 2. Fetch enrollments (user_progress) for these courses
    const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('course_id, progress, user_id')
        .in('course_id', courseIds)

    if (progressError) throw new Error(progressError.message)

    // 3. Aggregate Data
    const uniqueStudents = new Set(progress?.map(p => p.user_id)).size
    const totalEnrollments = progress?.length || 0

    const avgCompletion = totalEnrollments > 0
        ? Math.round(progress!.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrollments)
        : 0

    const activeCourses = courses.filter(c => c.published).length

    // Map enrollments to courses
    const enrollmentData = courses.map(course => {
        const count = progress?.filter(p => p.course_id === course.id).length || 0
        return {
            name: course.title,
            students: count
        }
    }).sort((a, b) => b.students - a.students).slice(0, 5) // Top 5 courses

    // Mock Activity Data (Last 7 days)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const recentActivity = days.map(day => ({
        name: day,
        active: Math.floor(Math.random() * (uniqueStudents + 5)) // Random data based on student count
    }))

    return {
        totalStudents: uniqueStudents,
        activeCourses,
        avgCompletion,
        enrollmentData,
        recentActivity
    }
}
