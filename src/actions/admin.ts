'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// We need a SERVICE ROLE client for Admin actions (creating/deleting users)
// This strictly runs on server
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

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string

    if (!email || !password) return { error: 'Missing fields' }

    const supabase = getAdminClient()

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Failed to create user' }

    // 2. Update Role in Profiles
    // The trigger might have created the profile with default 'student'
    // We force update it here
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', authData.user.id)

    if (profileError) {
        // If trigger failed, we might need to insert
        const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                role,
                username: fullName,
                xp: 0,
                streak: 0
            })
        if (insertError) return { error: insertError.message }
    }

    revalidatePath('/dashboard/admin/users')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = getAdminClient()

    // Deleting from auth.users cascades to profiles usually
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin/users')
    return { success: true }
}
