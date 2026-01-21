'use client'

import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
    primaryColor: string
    fontFamily: string
    setPrimaryColor: (color: string) => void
    setFontFamily: (font: string) => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            primaryColor: 'hsl(221.2 83.2% 53.3%)', // Default Blue
            fontFamily: 'var(--font-geist-sans)',
            setPrimaryColor: (color) => set({ primaryColor: color }),
            setFontFamily: (font) => set({ fontFamily: font }),
        }),
        {
            name: 'coursenation-theme',
        }
    )
)
