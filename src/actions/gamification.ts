'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function awardXP(amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // RPC setup would be better for atomicity, but simple increment works for MVP
    // Fetch current XP
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single()

    if (!profile) return { error: 'Profile not found' }

    const newXP = (profile.xp || 0) + amount

    const { error } = await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true, newXP }
}

export async function updateStreak() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // logic: check last activity. If yesterday, streak++. If today, ignore. If older, streak=1.
    // For MVP, we'll just increment for demo purposes when "Daily Login" happens
    // In production, you'd check a 'last_active_at' timestamp

    const { data: profile } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', user.id)
        .single()

    if (!profile) return { error: 'Profile not found' }

    const newStreak = (profile.streak || 0) + 1

    const { error } = await supabase
        .from('profiles')
        .update({ streak: newStreak })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true, newStreak }
}
