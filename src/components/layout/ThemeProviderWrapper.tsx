'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/useTheme'

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
    const { primaryColor, fontFamily } = useThemeStore()

    useEffect(() => {
        // This is a simplified way to inject CSS variables. 
        // In a production app, we might use a more robust CSS-in-JS solution or Tailwind config with CSS vars.
        document.documentElement.style.setProperty('--primary', primaryColor.replace('hsl(', '').replace(')', ''))
        // Note: Tailwind uses HSL values usually without the function wrapper for variable composition

        // Font family injection is trickier with Next.js fonts, 
        // but we can try to switch classNames or just set the variable
        // document.documentElement.style.setProperty('--font-geist-sans', fontFamily)
    }, [primaryColor, fontFamily])

    return <>{children}</>
}
