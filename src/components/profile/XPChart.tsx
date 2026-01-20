"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface XPData {
    day: string
    xp: number
}

export function XPChart({ data }: { data: XPData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>XP History</CardTitle>
                <CardDescription>Your learning progress this week</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="day"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="xp"
                            strokeWidth={2}
                            activeDot={{
                                r: 8,
                            }}
                            className="stroke-primary"
                            stroke="currentColor"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
