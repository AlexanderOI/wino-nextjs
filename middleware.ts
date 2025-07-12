import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next()

    response.headers.set("x-pathname", req.nextUrl.pathname)

    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/roles/:path*",
    "/company/:path*",
    "/project/:path*",
    "/manage-projects/:path*",
    "/users/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/forms/:path*",
  ],
}
