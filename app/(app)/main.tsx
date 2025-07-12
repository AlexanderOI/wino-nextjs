import { HeaderNav } from "@/components/header-nav"
import { Company } from "@/features/company/interfaces/company.interface"
import { apiClientServer } from "@/utils/api-client-server"
import { getSession } from "@/utils/get-session"

export async function Main({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  let companiesData: Company[] = []
  if (session) {
    try {
      const response = await apiClientServer.get<Company[]>("/company")
      companiesData = response.data
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="flex-1 overflow-x-hidden">
        <HeaderNav companiesData={companiesData || []} session={session} />
        <main className="flex-1 p-5 pb-0 overflow-x-hidden overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
