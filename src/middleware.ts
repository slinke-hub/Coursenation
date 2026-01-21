import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Initialize Response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Refresh Session
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // 2. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 3. Protected Routes
    const path = request.nextUrl.pathname

    // Explicitly exclude static files/assets from any logic if matcher misses them
    if (path.includes('.')) return NextResponse.next()

    const protectedPaths = ['/student', '/teacher', '/admin']

    if (protectedPaths.some(p => path.startsWith(p)) && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Redirect logged-in users away from auth pages
    if ((path === '/login' || path === '/') && user) {
        // Redirect based on role (simple check)
        // Access profile? For middleware speed, we trust the metadata or default to student
        // But we don't have metadata easily here without a DB call.
        // Let's just default to student for now.
        if (path === '/login') {
            return NextResponse.redirect(new URL('/student', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder references
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
