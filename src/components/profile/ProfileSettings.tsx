'use client'

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Upload, AlertTriangle } from "lucide-react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
    user: User
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState(user.email || '')
    const [password, setPassword] = useState('')
    const supabase = createClient()
    const router = useRouter()

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ email })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Check your new email for a confirmation link!")
        }
        setLoading(false)
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Password updated successfully")
            setPassword('') // Clear
        }
        setLoading(false)
    }

    // Avatar upload would go here (requires Storage bucket 'avatars')
    const handleAvatarUpload = async () => {
        toast.info("Avatar upload requires Storage configuration.")
    }

    const handleDeleteAccount = async () => {
        if (!confirm("Are you SURE? This action cannot be undone.")) return

        // Note: Supabase Client SDK doesn't allow deleting OWN user easily without admin function or specialized RPC
        // We usually hit a server action/api route.
        toast.error("Contact support to delete your account permanently.")
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Avatar Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                    <CardDescription>Click to upload a new avatar.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-2xl">LQ</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" onClick={handleAvatarUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Photo
                    </Button>
                </CardContent>
            </Card>

            {/* Email Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>Update your contact email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateEmail} className="flex gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="mt-auto">Update</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Secure your account with a new password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="flex gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <Button type="submit" disabled={loading || !password} className="mt-auto">Set Password</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account
                    </CardTitle>
                    <CardDescription>
                        Permanently remove your account and all data.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
