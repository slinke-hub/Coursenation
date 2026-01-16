export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'student' | 'teacher' | 'admin' | null
                    xp: number
                    streak: number
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    role?: 'student' | 'teacher' | 'admin' | null
                    xp?: number
                    streak?: number
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'student' | 'teacher' | 'admin' | null
                    xp?: number
                    streak?: number
                    avatar_url?: string | null
                    created_at?: string
                }
            }
        }
    }
}
