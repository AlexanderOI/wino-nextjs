export { default } from "next-auth/middleware"

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
