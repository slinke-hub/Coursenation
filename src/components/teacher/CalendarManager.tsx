'use client'

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getEvents, createEvent, deleteEvent } from "@/actions/calendar"
import { toast } from "sonner"
import { Clock, Trash2, Plus } from "lucide-react"
import { format } from "date-fns"

interface Event {
    id: string
    title: string
    description: string
    start_time: string
    end_time: string
}

export function CalendarManager() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    async function fetchEvents() {
        setLoading(true)
        const data = await getEvents()
        setEvents(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleCreateEvent = async (formData: FormData) => {
        // Validation handled in server action mostly, but we add date here
        if (date) {
            formData.append('date', format(date, 'yyyy-MM-dd'))
        }

        const result = await createEvent(formData)
        if (result.success) {
            toast.success("Event created successfully")
            setIsAddOpen(false)
            fetchEvents()
        } else {
            toast.error(result.error || "Failed to create event")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return
        const result = await deleteEvent(id)
        if (result.success) {
            toast.success("Event deleted")
            fetchEvents()
        } else {
            toast.error("Failed to delete")
        }
    }

    // Filter events for selected date
    const selectedDateEvents = events.filter(event => {
        if (!date) return false
        const eventDate = new Date(event.start_time)
        return eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
    })

    return (
        <div className="grid md:grid-cols-7 gap-6">
            <div className="md:col-span-3">
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                        <CardDescription>Select a date to view or add events.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                    </h2>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!date}>
                                <Plus className="mr-2 h-4 w-4" /> Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Event for {date ? format(date, 'MMM d') : ''}</DialogTitle>
                            </DialogHeader>
                            <form action={handleCreateEvent} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input name="title" required placeholder="e.g., Office Hours" />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea name="description" placeholder="Details..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startTime">Start Time</Label>
                                        <Input type="time" name="startTime" required defaultValue="09:00" />
                                    </div>
                                    <div>
                                        <Label htmlFor="endTime">End Time</Label>
                                        <Input type="time" name="endTime" required defaultValue="10:00" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Event</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <p className="text-muted-foreground">Loading events...</p>
                    ) : selectedDateEvents.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-8 text-center text-muted-foreground">
                                No events scheduled for this day.
                            </CardContent>
                        </Card>
                    ) : (
                        selectedDateEvents.map(event => (
                            <Card key={event.id} className="border-border bg-card">
                                <CardContent className="p-4 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                        <div className="flex items-center text-xs text-primary font-medium">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
