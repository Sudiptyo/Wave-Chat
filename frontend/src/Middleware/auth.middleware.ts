import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/about",
    "/ai",
    "/calls",
    "/chat",
    "/chats",
    "/communities",
    "/notifications",
    "/profile",
    "/search",
    "/settings",
    "/updates",
];

const authRoutes = [
    "/login",
    "/register",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken =
        request.cookies.get("AccessToken")?.value;

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`),
    );

    const isAuthRoute = authRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`),
    );

    // Not authenticated → protected route
    if (isProtectedRoute && !accessToken) {
        return NextResponse.redirect(
            new URL("/login", request.url),
        );
    }

    // Already authenticated → don't return to auth pages
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(
            new URL("/chats", request.url),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/about/:path*",
        "/ai/:path*",
        "/calls/:path*",
        "/chat/:path*",
        "/chats/:path*",
        "/communities/:path*",
        "/notifications/:path*",
        "/profile/:path*",
        "/search/:path*",
        "/settings/:path*",
        "/updates/:path*",
        "/login/:path*",
        "/register/:path*",
    ],
};

// matcher → tells Next.js when to invoke the middleware.
// protectedRoutes → tells your middleware what logic to apply once it is invoked.