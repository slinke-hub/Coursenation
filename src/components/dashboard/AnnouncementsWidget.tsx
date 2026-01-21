'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone } from "lucide-react"
import { getAnnouncements } from "@/actions/announcements"
import { useEffect, useState } from "react"

interface Announcement {
    id: string
    title: string
    content: string
    created_at: string
    profiles?: {
        username: string
    }
}

export function AnnouncementsWidget() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const data = await getAnnouncements()
                if (data) setAnnouncements(data)
            } catch (error) {
                console.error("Failed to fetch announcements", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnnouncements()
    }, [])

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Megaphone className="h-5 w-5 text-primary" />
                    Latest Announcements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {loading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
                ) : announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No new announcements.
                    </p>
                ) : (
                    announcements.map((item) => (
                        <div key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                                {item.content}
                            </p>
                            <span className="text-[10px] text-muted-foreground block mt-2">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
