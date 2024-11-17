import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      name: string
      userName: string
      email: string
      profile: string
      lang: string
      roleType: string
      permission: string[]
      companyId: number
    }
    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
    }
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number
      name: string
      userName: string
      email: string
      profile: string
      lang: string
      roleType: string
      permission: string[]
      companyId: number
    }
    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
    }
  }
}
