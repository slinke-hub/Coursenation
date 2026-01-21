
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export default function AdminSettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Configuration</CardTitle>
                        <CardDescription>Manage global platform settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                            <Switch id="maintenance-mode" />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="registrations">Allow New Registrations</Label>
                            <Switch id="registrations" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Settings</CardTitle>
                        <CardDescription>Configure system email preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="admin-email">Support Email</Label>
                            <Input id="admin-email" defaultValue="support@lingoquest.com" />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Button>Save Preferences</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
