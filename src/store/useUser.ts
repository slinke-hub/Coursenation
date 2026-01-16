import { create } from 'zustand'

interface UserState {
    xp: number
    streak: number
    role: 'student' | 'teacher' | 'admin' | null
    setXp: (xp: number) => void
    setStreak: (streak: number) => void
    setRole: (role: 'student' | 'teacher' | 'admin' | null) => void
}

export const useUserStore = create<UserState>((set) => ({
    xp: 0,
    streak: 0,
    role: null,
    setXp: (xp) => set({ xp }),
    setStreak: (streak) => set({ streak }),
    setRole: (role) => set({ role }),
}))
