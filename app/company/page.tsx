import { Card, CardContent } from "@/components/ui/card"
import { Company } from "@/stores/company.store"
import { CardHeaderPage } from "@/components/common/card-header-page"
import { CardCompany } from "@/features/company/components/card-company"
import { getSession } from "@/utils/get-session"
import apiClientServer from "@/utils/api-client-server"
import { DialogCompany } from "@/features/company/components/dialog-company"
import { Button } from "@/components/ui/button"

export default async function CompanyPage() {
  const session = await getSession()
  const response = await apiClientServer.get<Company[]>("/company")

  const companies = response.data

  const companiesOwner = companies.filter(
    (company) => company.owner._id === session?.user._id
  )

  const companiesEmployee = companies.filter(
    (company) =>
      company.users.includes(session?.user._id || "") &&
      company.owner._id !== session?.user._id
  )

  return (
    <div className="h-full">
      <CardHeaderPage>
        <h2>Company Management</h2>

        <DialogCompany>
          <Button className="bg-blue-400">Create Company</Button>
        </DialogCompany>
      </CardHeaderPage>

      <CardCompany companies={companiesOwner} title="My Companies" />

      <CardCompany companies={companiesEmployee} title="Companies I Work For" />
    </div>
  )
}
