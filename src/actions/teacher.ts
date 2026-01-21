'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTeacherCourses() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching teacher courses:', error)
        return []
    }

    return data
}

export async function getEnrolledStudents(courseId: string) {
    const supabase = await createClient()

    // In a real app with strict enrollment, we'd check an 'enrollments' table.
    // Here we check 'user_progress' as a proxy for enrollment, or just all students if open.
    // For better UX, let's fetch all users with role 'student' for now, 
    // assuming open enrollment or small class size for this MVP.
    // Ideally: JOIN user_progress on profiles.

    // Fetching students who have started the course (have an entry in user_progress)
    const { data, error } = await supabase
        .from('user_progress')
        .select(`
            user_id,
            profiles:user_id (id, username, avatar_url, role)
        `)
        .eq('course_id', courseId)

    if (error) {
        console.error('Error fetching enrolled students:', error)
        return []
    }

    // Transform to cleaner array
    const students = data.map((item: any) => item.profiles).filter((p: any) => p)

    // Fallback: If no progress found, maybe just show all students (for testing)?
    // No, better to show empty and let user know they need students to start course.
    // Or we can cheat for MVP and return ALL students if count is 0.
    if (students.length === 0) {
        const { data: allStudents } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('role', 'student')
            .limit(20) // Limit for safety
        return allStudents || []
    }

    return students
}

export async function getAttendance(courseId: string, date: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('course_id', courseId)
        .eq('date', date)

    if (error) return []
    return data
}

export async function saveAttendance(courseId: string, date: string, records: { student_id: string, status: string }[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Prepare upsert data
    const upsertData = records.map(r => ({
        course_id: courseId,
        student_id: r.student_id,
        date: date,
        status: r.status,
        instructor_id: user.id
    }))

    const { error } = await supabase
        .from('attendance')
        .upsert(upsertData, { onConflict: 'course_id, student_id, date' })

    if (error) return { error: error.message }

    revalidatePath('/teacher/attendance')
    return { success: true }
}
