'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useState } from "react"

export function ChatWindow() {
    const [messages, setMessages] = useState<{ user: string, text: string }[]>([
        { user: 'System', text: 'Welcome to the Global Chat!' }
    ])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim()) return
        setMessages([...messages, { user: 'Me', text: input }])
        setInput('')
        // Supabase Realtime logic here later
    }

    return (
        <Card className="h-[400px] flex flex-col border-border bg-card">
            <CardHeader className="p-3 border-b border-border">
                <CardTitle className="text-sm font-medium">Community Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-primary">{msg.user}</span>
                                <span className="text-sm p-2 rounded-lg bg-secondary/50 inline-block max-w-[80%] break-words">
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t border-border flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="bg-background"
                    />
                    <Button size="icon" onClick={handleSend}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
