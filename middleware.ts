import { clerkMiddleware, createRouteMatcher, AuthObject } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
];      

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware({
  // Only protect routes that aren't public
  publicRoutes: publicRoutes,
  // Optional: Add additional behavior for specific routes
  afterAuth(auth: AuthObject, req: NextRequest) {
    // Handle routing for authenticated users trying to access auth pages
    const { userId } = auth;
    const { pathname } = req.nextUrl;

    // If the user is authenticated and trying to access sign-in or sign-up pages, redirect to dashboard
    if (userId && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
      const dashboardUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // For all other routes, Clerk's middleware will handle authentication
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next/image|_next/static|favicon.ico).*)",
  ],
};
