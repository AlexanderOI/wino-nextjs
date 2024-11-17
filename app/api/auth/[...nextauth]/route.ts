import { BACKEND_URL } from "@/constants/routes"
import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendTokens.accessToken}`,
    },
  })

  const response = await res.json()
  return {
    ...token,
    backendTokens: response,
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.userName || !credentials.password) {
          return null
        }

        const res = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            userName: credentials.userName,
            password: credentials.password,
          }),
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) return null

        const user = await res.json()
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user }

      if (new Date().getTime() < token.backendTokens.expiresIn) return token

      return refreshToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.backendTokens = token.backendTokens

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
