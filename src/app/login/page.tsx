'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')

    // Auth State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Signup Extra State
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('other')
    const [country, setCountry] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isHuman, setIsHuman] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Auto-detect country
    useEffect(() => {
        if (mode === 'signup') {
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data.country_name) setCountry(data.country_name)
                })
                .catch(() => console.log('Could not detect country'))
        }
    }, [mode])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'signup') {
                // Validation
                if (password !== confirmPassword) throw new Error("Passwords do not match")
                if (!isHuman) throw new Error("Please confirm you are not a robot")
                if (!fullName) throw new Error("Full Name is required")

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            full_name: fullName,
                            phone,
                            gender,
                            country,
                            username: email.split('@')[0] // Fallback username
                        }
                    },
                })
                if (error) throw error
                // In a real app we might wait for email verify, but Supabase might auto-login on dev if disabled
                alert('Account created! Please check your email to verify.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/student')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOAuth = async (provider: 'google') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 py-8">
            <Card className="w-full max-w-lg border-border bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {mode === 'signin'
                            ? 'Enter your credentials to access your portal'
                            : 'Join our community of learners today'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mode === 'signin' && (
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full" onClick={() => handleOAuth('google')}>
                                Continue with Google
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-muted" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {/* Signup Fields */}
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country (Detected)</Label>
                                        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Auto-detecting..." readOnly className="bg-muted" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} className="accent-primary" />
                                            <span>Male</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} className="accent-primary" />
                                            <span>Female</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="radio" checked={gender === 'other'} onChange={() => setGender('other')} className="accent-primary" />
                                            <span>Prefer not to say</span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        {/* Confirm Password */}
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        )}

                        {/* Captcha */}
                        {mode === 'signup' && (
                            <div className="flex items-center space-x-2 p-4 border rounded-md bg-muted/20">
                                <input
                                    type="checkbox"
                                    id="captcha"
                                    checked={isHuman}
                                    onChange={(e) => setIsHuman(e.target.checked)}
                                    className="h-5 w-5 accent-primary cursor-pointer"
                                />
                                <Label htmlFor="captcha" className="cursor-pointer">I am not a robot</Label>
                            </div>
                        )}

                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : mode === 'signin' ? (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" /> Create Account
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                        {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
