'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BookOpen, Trophy, Users, Settings, LogOut, Shield, Gamepad2, BarChart, Megaphone, ClipboardCheck, Calendar } from 'lucide-react'
import { useUserStore } from '@/store/useUser'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

const studentLinks = [
    { href: '/student', label: 'Home', icon: Home },
    { href: '/student/courses', label: 'Courses', icon: BookOpen },
    { href: '/student/profile', label: 'Profile', icon: Users },
    { href: '/student/practice', label: 'Practice', icon: BookOpen }, // Using BookOpen temporarily or maybe Zap/Brain
    { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
]

const teacherLinks = [
    { href: '/teacher', label: 'Dashboard', icon: Home },
    { href: '/teacher/courses', label: 'My Courses', icon: BookOpen },
    { href: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { href: '/teacher/calendar', label: 'Calendar', icon: Calendar },
    { href: '/teacher/analytics', label: 'Analytics', icon: BarChart },
]

const adminLinks = [
    { href: '/admin', label: 'Overview', icon: Shield },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { role, setRole } = useUserStore()

    const links = role === 'teacher' ? teacherLinks : role === 'admin' ? adminLinks : studentLinks

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/' // Force reload to clear client state
    }

    return (
        <aside className="hidden w-64 flex-col border-r bg-card/50 backdrop-blur md:flex h-full">
            <div className="p-6 flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-primary">Coursenation</h2>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                isActive
                                    ? "bg-secondary text-primary"
                                    : "text-muted-foreground hover:bg-secondary/50"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>

                {/* Dev Tool: Role Switcher */}
                <div>
                    <p className="text-xs text-muted-foreground mb-2">Dev: Switch Role</p>
                    <div className="flex gap-2 justify-between">
                        <Button variant="ghost" size="icon" onClick={() => setRole('student')} title="Student" className={role === 'student' || !role ? 'text-primary' : ''}>
                            <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setRole('teacher')} title="Teacher" className={role === 'teacher' ? 'text-primary' : ''}>
                            <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setRole('admin')} title="Admin" className={role === 'admin' ? 'text-primary' : ''}>
                            <Shield className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
