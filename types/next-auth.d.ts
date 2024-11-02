import "next-auth"

declare module "next-auth" {
  interface Session {
    user: UserInterface
    token: TokenInterface
  }
}

type UserInterface = {
  id: number
  name: string
  userName: string
  email: string
  profile: string
  lang: string
  roleType: string
  permission: string[]
  companyPersonalId: number
}

interface TokenInterface {
  user: UserInterface
  token: string
}
