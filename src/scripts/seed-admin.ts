
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

const ADMIN_EMAIL = 'monti.training@gmail.com'
const ADMIN_PASSWORD = '0912577754Asd|'

async function seedAdmin() {
    console.log(`Checking for admin user: ${ADMIN_EMAIL}`)

    // 1. Check if user exists (this uses Admin API which lists users)
    // But standard supabase-js client doesn't expose listUsers easily without adminauth client
    // Just try to signIn first to see if exists? No, better to try getting user by email or just create.
    // Actually, listUsers() is available on auth.admin

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    const existingUser = users.find(u => u.email === ADMIN_EMAIL)
    let userId = existingUser?.id

    if (!existingUser) {
        console.log('User not found. Creating...')
        const { data, error } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: 'Super Admin' }
        })

        if (error) {
            console.error('Error creating user:', error)
            return
        }

        if (!data.user) {
            console.error('User creation returned no data')
            return
        }

        userId = data.user.id
        console.log(`User created with ID: ${userId}`)

        // NOTE: Our trigger in Supabase (handle_new_user) should have created a profile.
        // However, triggers on auth.users SOMETIMES don't fire for admin.createUser depending on setup.
        // Let's verify and upsert profile to be safe.
    } else {
        console.log(`User already exists with ID: ${userId}`)
        if (userId) {
            // Reset password to ensure it matches what user asked
            const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                password: ADMIN_PASSWORD
            })
            if (updateError) console.error("Could not update password:", updateError)
            else console.log("Password updated/verified.")
        }
    }

    if (userId) {
        console.log('Updating role to ADMIN in profiles table...')
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                role: 'admin',
                email: ADMIN_EMAIL // If we added email column, but we removed it in schema. Just updating role.
                // Oh wait, schema doesn't have email in profiles? 
                // We only have: id, role, xp, streak, avatar_url, username
            })

        // Wait, the trigger handle_new_user inserts (id, role, xp, streak, username).
        // We just need to update the ROLE.

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId)

        if (updateError) {
            console.error('Error updating profile role:', updateError)
        } else {
            console.log('Successfully set user as ADMIN')
        }
    }
}

seedAdmin()
