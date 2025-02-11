import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: UserAuth
    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
      statusCode?: number
    }
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    user: UserAuth
    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
      statusCode?: number
    }
  }
}

interface UserAuth {
  _id: string
  name: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
  companyId: string
  companyName: string
  permissions: string[]
  avatar: string
}
