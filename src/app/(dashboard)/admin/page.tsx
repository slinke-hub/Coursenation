export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-card">
                    <h3 className="font-semibold">User Management</h3>
                    <p className="text-sm text-muted-foreground">Manage roles and permissions.</p>
                </div>
            </div>
        </div>
    )
}
