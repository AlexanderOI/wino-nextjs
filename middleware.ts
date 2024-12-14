export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/roles/:path*", "/company/:path*"],
}
