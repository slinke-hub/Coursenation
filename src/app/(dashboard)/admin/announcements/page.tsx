import { createAnnouncement, deleteAnnouncement, getAnnouncements } from "@/actions/announcements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Megaphone } from "lucide-react"

export default async function AdminAnnouncementsPage() {
    const announcements = await getAnnouncements()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                <Megaphone className="h-8 w-8" />
                Announcements
            </h1>

            {/* Create Announcement Form */}
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-lg">Post New Announcement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        'use server'
                        await createAnnouncement(formData)
                    }} className="space-y-4">
                        <div>
                            <Input name="title" placeholder="Announcement Title" required />
                        </div>
                        <div>
                            <Textarea name="content" placeholder="Detailed content..." required className="min-h-[100px]" />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Post Announcement</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Announcements List */}
            <div className="grid gap-4">
                {announcements?.map((item: any) => (
                    <Card key={item.id} className="border-border bg-card">
                        <CardContent className="p-4 flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                                <div className="text-xs text-muted-foreground pt-2">
                                    Posted by {item.profiles?.username || 'Admin'} on {new Date(item.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <form action={async () => {
                                'use server'
                                await deleteAnnouncement(item.id)
                            }}>
                                <Button variant="destructive" size="icon" title="Delete Announcement">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
                {announcements?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No announcements posted yet.
                    </div>
                )}
            </div>
        </div>
    )
}
