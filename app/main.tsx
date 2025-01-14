import { HeaderNav } from "@/components/HeaderNav"
import { PermissionServer } from "@/features/permission/permission-server"
import { Company } from "@/stores/company.store"
import apiClientServer from "@/utils/api-client-server"
import { getSession } from "@/utils/get-session"

export async function Main({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  let companiesData: Company[] = []
  if (session) {
    const response = await apiClientServer.get<Company[]>("/company")
    companiesData = response.data
  }

  return (
    <div className="flex h-screen flex-1 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <PermissionServer>
          <HeaderNav companiesData={companiesData || []} />
        </PermissionServer>
        <main
          className={`flex-1 p-5 overflow-hidden ${
            session ? "h-[calc(100vh-5rem)]" : "h-screen"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
