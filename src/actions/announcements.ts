'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from "@/utils/supabase/server"

// Service Role Client for Admin Mutations
function getAdminClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing Service Role Key')
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

export async function createAnnouncement(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    // Get current user ID to set as author
    const supabaseUser = await createServerClient()
    const { data: { user } } = await supabaseUser.auth.getUser()

    if (!user) return { error: 'Unauthorized' }
    if (!title || !content) return { error: 'Missing fields' }

    const adminClient = getAdminClient()

    const { error } = await adminClient
        .from('announcements')
        .insert({
            title,
            content,
            author_id: user.id
        })

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/admin/announcements')
    return { success: true }
}

export async function deleteAnnouncement(id: string) {
    const adminClient = getAdminClient()
    const { error } = await adminClient.from('announcements').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/admin/announcements')
    return { success: true }
}

export async function getAnnouncements() {
    // Normal client for fetching (RLS allows everyone to view)
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('announcements')
        .select(`
            *,
            profiles:author_id (username, role)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) throw new Error(error.message)
    return data
}
