'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus, RefreshCw, ShieldCheck } from 'lucide-react'


export default function LoginPage() {
    // Mode
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')

    // Form Fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Sign Up Extras
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [country, setCountry] = useState('Detecting...')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Captcha
    const [captcha, setCaptcha] = useState({ a: 0, b: 0 })
    const [captchaAnswer, setCaptchaAnswer] = useState('')
    const [captchaVerified, setCaptchaVerified] = useState(false)

    // State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Auto-detect country & Init Captcha
    useEffect(() => {
        // Init Captcha
        setCaptcha({
            a: Math.floor(Math.random() * 10) + 1,
            b: Math.floor(Math.random() * 10) + 1
        })

        // Detect Country
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_name) setCountry(data.country_name)
                else setCountry('Unknown')
            })
            .catch(() => setCountry('Unknown'))
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'signup') {
                // Validation
                if (password !== confirmPassword) throw new Error("Passwords do not match")
                if (parseInt(captchaAnswer) !== (captcha.a + captcha.b)) throw new Error("Incorrect CAPTCHA answer")
                if (!fullName) throw new Error("Full Name is required")
                if (!gender) throw new Error("Gender is required")

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            full_name: fullName,
                            phone: phone,
                            gender: gender,
                            country: country
                        }
                    },
                })
                if (error) throw error
                setError(null)
                alert('Success! Check your email for the confirmation link to complete registration.')
            } else {
                // Sign In
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/student')
                router.refresh()
            }
        } catch (err: any) {
            console.error("Auth Error:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const refreshCaptcha = () => {
        setCaptcha({
            a: Math.floor(Math.random() * 10) + 1,
            b: Math.floor(Math.random() * 10) + 1
        })
        setCaptchaAnswer('')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 py-8">
            <Card className="w-full max-w-md border-2 border-border/50 shadow-xl my-8">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">
                        {mode === 'signin' ? 'Welcome Back to Coursenation' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {mode === 'signin'
                            ? 'Enter your credentials to access your portal'
                            : 'Join Coursenation today'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleAuth} className="space-y-4">

                        {/* Sign Up Specific Fields */}
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        required
                                        className="border-primary/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1234567890"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select onValueChange={setGender} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country (Auto-detected)</Label>
                                    <Input
                                        id="country"
                                        value={country}
                                        readOnly
                                        className="bg-muted text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {mode === 'signup' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={confirmPassword && password !== confirmPassword ? "border-destructive" : ""}
                                    />
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-destructive">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Robot Check */}
                                <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">Security Check</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-mono font-bold bg-white text-black px-3 py-1 rounded border-2 border-primary/20">
                                            {captcha.a} + {captcha.b} = ?
                                        </span>
                                        <Input
                                            className="w-20 border-primary/20"
                                            placeholder="?"
                                            value={captchaAnswer}
                                            onChange={e => setCaptchaAnswer(e.target.value)}
                                            required
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha} title="New Challenge">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && <p className="text-sm text-destructive font-bold text-center bg-destructive/10 p-2 rounded">{error}</p>}

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
                    <Button variant="link" onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin')
                        setError(null)
                    }}>
                        {mode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
