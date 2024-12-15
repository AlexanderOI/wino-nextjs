import { getSession } from "@/utils/get-session"

export async function PermissionServer({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) return null

  return <>{children}</>
}
