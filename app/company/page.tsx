import { Company } from "@/features/company/interfaces/company.interface"
import { CardHeaderPage } from "@/components/common/card-header-page"
import { CardCompany } from "@/features/company/components/card-company"
import { getSession } from "@/utils/get-session"
import { apiClientServer } from "@/utils/api-client-server"
import { DialogCompany } from "@/features/company/components/dialog-company"
import { Button } from "@/components/ui/button"
import { TypographyH1 } from "@/components/ui/typography"
import { PermissionServer } from "@/features/permission/permission-server"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

export default async function CompanyPage() {
  const session = await getSession()
  const response = await apiClientServer.get<Company[]>("/company")

  const companies = response.data

  const companiesOwner = companies.filter(
    (company) => company.owner._id === session?.user._id
  )

  const companiesEmployee = companies.filter(
    (company) => company.owner._id !== session?.user._id
  )

  return (
    <div className="h-full">
      <CardHeaderPage>
        <TypographyH1>Company Management</TypographyH1>

        <PermissionServer permissions={[PERMISSIONS.CREATE_COMPANY]}>
          <DialogCompany>
            <Button className="bg-purple-light text-white">Create Company</Button>
          </DialogCompany>
        </PermissionServer>
      </CardHeaderPage>

      <CardCompany
        isOwner={true}
        companies={companiesOwner}
        title="My Companies (Owner)"
      />

      <CardCompany
        isOwner={false}
        companies={companiesEmployee}
        title="Companies I Work For"
      />
    </div>
  )
}
