import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUser, deleteUser } from '@/actions/admin'
import { Trash2 } from 'lucide-react'

export default async function AdminUsersPage() {
    const supabase = await createClient()

    // Fetch profiles joined with auth data is unreliable without direct DB access or Admin API
    // Standard approach: Fetch profiles from public table
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">User Management</h1>

            {/* Add User Form */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        'use server'
                        await createUser(formData)
                    }} className="flex gap-4 items-end flex-wrap">
                        <div className="space-y-2">
                            <Input name="email" placeholder="Email" required />
                        </div>
                        <div className="space-y-2">
                            <Input name="password" type="password" placeholder="Password" required />
                        </div>
                        <div className="space-y-2">
                            <Input name="fullName" placeholder="Full Name" />
                        </div>
                        <div className="space-y-2 w-[180px]">
                            <Select name="role" defaultValue="student">
                                <SelectTrigger>
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">Create User</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Users List */}
            <div className="grid gap-4">
                {profiles?.map((profile: any) => (
                    <Card key={profile.id} className="border-border bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{profile.username || 'No Name'}</h3>
                                <div className="flex gap-2 text-sm text-muted-foreground">
                                    <span className="capitalize px-2 py-0.5 rounded bg-secondary">
                                        {profile.role}
                                    </span>
                                    <span>XP: {profile.xp}</span>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server'
                                await deleteUser(profile.id)
                            }}>
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
