'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User, Bell } from 'lucide-react'
import { useUserStore } from '@/store/useUser'

export function Header() {
    const router = useRouter()
    // In a real app, we'd fetch the user's avatar from properties or store
    // For now we use the store placeholder or generic
    const { role } = useUserStore()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <header className="border-b bg-card/50 backdrop-blur h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Left side (Breadcrumbs or Page Title could go here) */}
            <div className="font-semibold text-lg text-foreground">
                {/* Dashboard */}
            </div>

            {/* Right side: Actions & Profile */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                            <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors">
                                <AvatarImage src="" /> {/* Todo: User Avatar */}
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    LQ
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">My Account</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {role ? role.toUpperCase() : 'STUDENT'}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/${role || 'student'}/profile`)}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${role || 'student'}/settings`)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        {/* Inbox link could go here if implemented, using Settings for now as placeholder */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
