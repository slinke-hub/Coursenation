'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
    const [status, setStatus] = useState<string>('Ready to test')
    const [details, setDetails] = useState<string>('')
    const supabase = createClient()

    const checkSchema = async () => {
        setStatus('Checking Database...')
        setDetails('')

        try {
            // Try to select the new columns. If they don't exist, this will throw an error.
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, phone, gender, country')
                .limit(1)

            if (error) {
                setStatus('❌ Schema Check FAILED')
                setDetails(JSON.stringify(error, null, 2))
            } else {
                setStatus('✅ Schema Check PASSED')
                setDetails('Columns exist! Database is correctly migrated.\n\nData Sample:\n' + JSON.stringify(data, null, 2))
            }
        } catch (err: any) {
            setStatus('❌ Connection Error')
            setDetails(err.message)
        }
    }

    return (
        <div className="p-8 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Database Debugger</h1>
            <Button onClick={checkSchema}>Check Database Schema</Button>

            <div className="p-4 rounded border bg-muted">
                <div className="font-bold mb-2">Status: {status}</div>
                <pre className="text-xs overflow-auto whitespace-pre-wrap">{details}</pre>
            </div>
        </div>
    )
}
