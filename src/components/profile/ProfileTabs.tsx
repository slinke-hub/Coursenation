'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./ProfileSettings"
import { User } from "@supabase/supabase-js"

interface ProfileTabsProps {
    user: User
    overviewContent: React.ReactNode
}

export function ProfileTabs({ user, overviewContent }: ProfileTabsProps) {
    return (
        <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background border">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Manage Account</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                {overviewContent}
            </TabsContent>

            <TabsContent value="settings">
                <ProfileSettings user={user} />
            </TabsContent>
        </Tabs>
    )
}
