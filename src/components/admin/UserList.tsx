'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { deleteUser, updateUserRole } from "@/actions/admin"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

interface Profile {
    id: string
    username: string
    role: string
    xp: number
    email?: string // Might not be available in profile depending on join
}

export function UserList({ profiles }: { profiles: Profile[] }) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
    const [newRole, setNewRole] = useState("")

    const handleEditClick = (profile: Profile) => {
        setSelectedUser(profile)
        setNewRole(profile.role)
        setIsEditOpen(true)
    }

    const handleSaveRole = async () => {
        if (!selectedUser) return

        const result = await updateUserRole(selectedUser.id, newRole)
        if (result.success) {
            toast.success("User role updated successfully")
            setIsEditOpen(false)
            setSelectedUser(null)
        } else {
            toast.error("Failed to update role")
        }
    }

    const handleDelete = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const result = await deleteUser(userId)
            if (result.success) {
                toast.success("User deleted successfully")
            } else {
                toast.error("Failed to delete user")
            }
        }
    }

    return (
        <div className="grid gap-4">
            {profiles?.map((profile) => (
                <Card key={profile.id} className="border-border bg-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">{profile.username || 'No Name'}</h3>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                                <span className={`capitalize px-2 py-0.5 rounded ${profile.role === 'admin' ? 'bg-destructive/10 text-destructive' :
                                        profile.role === 'teacher' ? 'bg-primary/10 text-primary' : 'bg-secondary'
                                    }`}>
                                    {profile.role}
                                </span>
                                <span>XP: {profile.xp}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(profile)}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(profile.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Role</DialogTitle>
                        <DialogDescription>
                            Change the permission level for {selectedUser?.username}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveRole}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
