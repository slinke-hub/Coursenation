import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback or early return if env vars missing to prevent 500 crash
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Middleware Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')
        return response
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value)
                        })
                        response = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const path = request.nextUrl.pathname

        // Explicitly exclude static files
        if (path.includes('.')) return NextResponse.next()

        const protectedPaths = ['/student', '/teacher', '/admin']

        if (protectedPaths.some(p => path.startsWith(p)) && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if ((path === '/login' || path === '/') && user) {
            if (path === '/login') {
                return NextResponse.redirect(new URL('/student', request.url))
            }
        }
    } catch (e) {
        console.error('Middleware Supabase Client Error:', e)
        // Ensure we don't block the request if middleware fails
        return response
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
