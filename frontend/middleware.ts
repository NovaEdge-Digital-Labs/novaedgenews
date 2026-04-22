import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        // For browser navigation where token is in cookie or not present yet.
        // If we rely on cookies, grab it from request.cookies. But the spec says 'Authorization header'. 
        // In a real app we might use cookies for SSR access. Let's check cookies too.
        const cookieToken = request.cookies.get('admin_token')?.value;
        if (!cookieToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    const tokenToVerify = token || request.cookies.get('admin_token')?.value;

    try {
        const verified = await jwtVerify(
            tokenToVerify as string,
            new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret')
        );

        if (verified.payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};
