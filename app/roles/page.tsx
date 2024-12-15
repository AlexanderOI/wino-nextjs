import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ROLES_URL } from "@/constants/routes"
import { Roles } from "@/types/global"
import { CardHeaderPage } from "@/components/common/card-header-page"
import DataTableRoles from "@/features/roles/components/data-table-roles"
import apiClientServer from "@/utils/api-client-server"
import { DialogRole } from "@/features/roles/components/dialog-role"

export default async function RolesPage() {
  const response = await apiClientServer.get<Roles[]>(ROLES_URL)
  const roles = response.data

  return (
    <div className="h-full">
      <CardHeaderPage>
        <h2>Roles and Permissions Management</h2>

        <DialogRole>
          <Button className="bg-blue-400">Create Role</Button>
        </DialogRole>
      </CardHeaderPage>

      <Card className="dark:bg-dark-800 rounded h-5/6 overflow-y-auto">
        <CardContent className="h-full">
          <DataTableRoles roles={roles} />
        </CardContent>
      </Card>
    </div>
  )
}
