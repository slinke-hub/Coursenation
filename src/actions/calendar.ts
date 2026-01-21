'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getEvents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('instructor_id', user.id)
        .order('start_time', { ascending: true })

    if (error) return []
    return data
}

export async function createEvent(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string

    if (!title || !date || !startTime || !endTime) return { error: 'Missing fields' }

    // Construct timestamps
    const start = new Date(`${date}T${startTime}:00`).toISOString()
    const end = new Date(`${date}T${endTime}:00`).toISOString()

    const { error } = await supabase
        .from('events')
        .insert({
            title,
            description,
            start_time: start,
            end_time: end,
            instructor_id: user.id
        })

    if (error) return { error: error.message }

    revalidatePath('/teacher/calendar')
    return { success: true }
}

export async function deleteEvent(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/teacher/calendar')
    return { success: true }
}
