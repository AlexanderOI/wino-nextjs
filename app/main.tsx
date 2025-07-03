import { HeaderNav } from "@/components/HeaderNav"
import { Company } from "@/features/company/interfaces/company.interface"
import { PermissionServer } from "@/features/permission/permission-server"
import { cn } from "@/lib/utils"
import { apiClientServer } from "@/utils/api-client-server"
import { getSession } from "@/utils/get-session"

export async function Main({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  let companiesData: Company[] = []
  if (session) {
    const response = await apiClientServer.get<Company[]>("/company")
    companiesData = response.data
  }

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="flex-1 overflow-x-hidden">
        <PermissionServer>
          <HeaderNav companiesData={companiesData || []} session={session} />
        </PermissionServer>
        <main
          className={cn(
            "flex-1 p-5 pb-0 overflow-x-hidden overflow-y-auto",
            session ? "h-[calc(100vh-4rem)]" : "h-screen"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
