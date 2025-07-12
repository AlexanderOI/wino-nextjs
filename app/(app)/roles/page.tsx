import { apiClientServer } from "@/utils/api-client-server"
import { Role, Permissions } from "@/features/roles/interfaces/role.interface"

import { RolesData } from "@/features/roles/components/roles-data"

interface PermissionCategory {
  [key: string]: Permissions[]
}

export default async function RolesPage() {
  const { data: roles } = await apiClientServer.get<Role[]>("/roles")
  const { data: permissions } = await apiClientServer.get<Permissions[]>("permissions")

  const permisionsGrouped = permissions.reduce((acc: PermissionCategory, permission) => {
    const category = permission.name.split("-").at(-1) ?? ""
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(permission)
    return acc
  }, {})

  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <RolesData
          roles={roles}
          permissions={permissions}
          permisionsGrouped={permisionsGrouped}
        />
      </div>
    </div>
  )
}
