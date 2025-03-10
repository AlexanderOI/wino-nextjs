"use client"

import { useState } from "react"
import { Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { apiClient } from "@/utils/api-client"
import { Role, Permissions } from "@/features/roles/interfaces/role.interface"

import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { PermissionClient } from "@/features/permission/permission-client"
import { RoleCard } from "@/features/roles/components/role-card"

interface Props {
  roles: Role[]
  permissions: Permissions[]
  permisionsGrouped: { [key: string]: Permissions[] }
}

export function RolesData({
  roles: initialRoles,
  permissions,
  permisionsGrouped,
}: Props) {
  const [roles, setRoles] = useState(initialRoles)

  const [search, setSearch] = useState("")

  const handleCreateRole = () => {
    if (roles.find((role) => role._id === "")) return

    setRoles([
      {
        _id: "",
        name: "",
        description: "",
        permissions: [],
      },
      ...roles,
    ])
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role._id !== roleId))
  }

  const refreshRoles = async () => {
    const { data } = await apiClient.get<Role[]>("/roles")
    setRoles(data)
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Roles and Permissions
          </h1>
          <p className="text-gray-400 mt-1">Manage roles and permissions</p>
        </div>

        <PermissionClient permissions={[PERMISSIONS.CREATE_ROLE]}>
          <Button variant="purple" onClick={handleCreateRole}>
            Create Role
          </Button>
        </PermissionClient>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search roles..."
              className="pl-9   text-gray-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid gap-6">
          {roles
            .filter((role) => role.name.toLowerCase().includes(search.toLowerCase()))
            .map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                permissions={permissions}
                permisionsGrouped={permisionsGrouped}
                refreshRoles={refreshRoles}
                handleDeleteRole={handleDeleteRole}
              />
            ))}
        </div>
      </div>
    </>
  )
}
