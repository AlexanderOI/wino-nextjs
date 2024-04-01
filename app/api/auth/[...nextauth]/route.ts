import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { json } from "stream/consumers"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        )

        if (!res.ok) return null

        const user = await res.json()
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      return { ...token, ...user }
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
