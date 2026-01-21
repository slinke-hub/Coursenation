'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCourse(id: string) {
    const supabase = await createClient()
    const { data: course } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                *,
                lessons (*)
            )
        `)
        .eq('id', id)
        .single()

    // Sort modules and lessons by sort_order
    if (course && course.modules) {
        course.modules.sort((a: any, b: any) => a.sort_order - b.sort_order)
        course.modules.forEach((m: any) => {
            if (m.lessons) {
                m.lessons.sort((a: any, b: any) => a.sort_order - b.sort_order)
            }
        })
    }

    return course
}

export async function updateCourseDetails(id: string, data: { title?: string, description?: string, published?: boolean }) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('courses')
        .update(data)
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${id}/edit`)
    return { success: true }
}

export async function createModule(courseId: string, title: string, sortOrder: number) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('modules')
        .insert({ course_id: courseId, title, sort_order: sortOrder })

    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}

export async function deleteModule(moduleId: string, courseId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId)

    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}

export async function updateModule(moduleId: string, courseId: string, data: { title: string }) {
    const supabase = await createClient()
    const { error } = await supabase.from('modules').update(data).eq('id', moduleId)
    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}

export async function createLesson(moduleId: string, courseId: string, title: string, sortOrder: number) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('lessons')
        .insert({ module_id: moduleId, title, sort_order: sortOrder })

    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}

export async function updateLesson(lessonId: string, courseId: string, data: { title?: string, video_id?: string, content?: string, is_locked?: boolean }) {
    const supabase = await createClient()
    const { error } = await supabase.from('lessons').update(data).eq('id', lessonId)
    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}

export async function getEnrolledCourses() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Join user_progress with courses to get enrolled course details
    const { data, error } = await supabase
        .from('user_progress')
        .select(`
            progress,
            completed,
            last_accessed,
            course:courses (
                id,
                title,
                description,
                thumbnail_url,
                instructor:profiles(username)
            )
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error("Error fetching enrolled courses:", error)
        return []
    }

    return data.map((item: any) => ({
        ...item.course,
        progress: item.progress,
        completed: item.completed
    }))
}
