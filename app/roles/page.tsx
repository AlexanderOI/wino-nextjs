import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PERMISSIONS_URL, ROLES_URL } from "@/constants/routes"
import { Roles, Permissions } from "@/types/global"
import { CardHeaderPage } from "@/components/common/card-header-page"
import DataTableRoles from "@/features/roles/components/data-table-roles"
import apiClientServer from "@/utils/api-client-server"
import { DialogRole } from "@/features/roles/components/dialog-role"

export default async function RolesPage() {
  const response = await apiClientServer.get<Roles[]>(ROLES_URL)
  const responsePermissions = await apiClientServer.get<Permissions[]>(PERMISSIONS_URL)
  const roles = response.data
  const permissions = responsePermissions.data

  return (
    <div className="h-full">
      <CardHeaderPage>
        <h2>Roles and Permissions Management</h2>

        <DialogRole>
          <Button className="bg-purple-light text-white">Create Role</Button>
        </DialogRole>
      </CardHeaderPage>

      <Card className="dark:bg-dark-800 rounded h-5/6 overflow-y-auto">
        <CardContent className="h-full">
          <DataTableRoles roles={roles} permissions={permissions} />
        </CardContent>
      </Card>
    </div>
  )
}
