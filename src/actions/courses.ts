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

export async function deleteLesson(lessonId: string, courseId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)

    if (error) return { error: error.message }
    revalidatePath(`/teacher/courses/${courseId}/edit`)
    return { success: true }
}
