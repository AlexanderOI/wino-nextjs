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
  username: string
  email: string
  profile: string
  lang: string
  role_type: string
  permission: string[]
}

interface TokenInterface {
  user: UserInterface
  token: string
}
