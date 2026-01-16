'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUserStore } from '@/store/useUser'
import { useRouter } from 'next/navigation'

export function useGamification() {
    const { xp, streak, setXp, setStreak, setRole } = useUserStore()
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Initial fetch
        async function fetchUserData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile) {
                setXp(profile.xp)
                setStreak(profile.streak)
                setRole(profile.role)
            }
        }

        fetchUserData()

        // Realtime subscription
        const channel = supabase
            .channel('gamification')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${(supabase.auth.getUser() as any).id}`, // Note: this might need refinement for auth.uid() in filters
                },
                (payload) => {
                    const newProfile = payload.new as any
                    setXp(newProfile.xp)
                    setStreak(newProfile.streak)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [setXp, setStreak, setRole, supabase])

    return { xp, streak }
}
