"use client"

import { useState } from "react"
import {
  Users,
  Settings,
  Layout,
  FileText,
  User,
  Building2,
  MoreVertical,
  Columns,
  LayoutDashboard,
} from "lucide-react"

import { apiClient } from "@/utils/api-client"
import { Role, Permissions } from "@/features/roles/interfaces/role.interface"

import { toast } from "@/components/ui/use-toast"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { PermissionClient } from "@/features/permission/permission-client"

interface Props {
  role: Role
  permissions: Permissions[]
  permisionsGrouped: { [key: string]: Permissions[] }
  refreshRoles: () => Promise<void>
  handleDeleteRole: (roleId: string) => void
}

export const RoleCard = ({
  role,
  permissions,
  permisionsGrouped,
  refreshRoles,
  handleDeleteRole,
}: Props) => {
  const [open, setOpen] = useState(role._id === "")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [rolePermissions, setRolePermissions] = useState<string[]>(role.permissions)
  const [roleName, setRoleName] = useState(role.name)
  const [roleDescription, setRoleDescription] = useState(role.description)

  const [error, setError] = useState({
    name: "",
    description: "",
    permissions: "",
  })

  const handlePermissionChange = (permission: string) => {
    if (rolePermissions.includes(permission)) {
      setRolePermissions((prev) => prev.filter((p) => p !== permission))
    } else {
      setRolePermissions((prev) => [...prev, permission])
    }
  }

  const handleSave = async () => {
    let error = false
    if (roleName.length === 0) {
      setError((prev) => ({ ...prev, name: "Name is required" }))
      error = true
    }

    if (roleDescription.length === 0) {
      setError((prev) => ({ ...prev, description: "Description is required" }))
      error = true
    }

    if (rolePermissions.length === 0) {
      setError((prev) => ({
        ...prev,
        permissions: "At least one permission is required",
      }))
      error = true
    }

    if (error) return

    try {
      if (role._id.length > 0) {
        await apiClient.patch(`/roles/${role._id}`, {
          name: roleName,
          description: roleDescription,
          permissions: rolePermissions,
        })
      } else {
        await apiClient.post("/roles", {
          name: roleName,
          description: roleDescription,
          permissions: rolePermissions,
        })
      }

      await refreshRoles()
      setOpen(false)
      toast({
        title: "Role saved",
        description: "Role has been saved successfully",
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: "Error saving role",
        description: "Error saving role",
        duration: 2000,
      })
    }
  }

  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card key={role.name}>
          <CardHeader className="flex flex-row  justify-between">
            {!open ? (
              <div className="space-y-1 w-3/12">
                <CardTitle className="text-xl flex gap-2">{role.name}</CardTitle>
                <p className="text-sm text-gray-400">{role.description}</p>
              </div>
            ) : (
              <div className="space-y-1 w-full">
                <Input
                  placeholder="Role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                {error.name && <p className="text-red-400 text-sm">{error.name}</p>}
                <Input
                  placeholder="Role description"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                />
                {error.description && (
                  <p className="text-red-400 text-sm">{error.description}</p>
                )}
              </div>
            )}

            {!open ? (
              <div className="flex flex-wrap items-center gap-1 w-full">
                {role.permissions.map((permission) => (
                  <Badge variant="purple" className="ml-2" key={permission}>
                    {permissions.find((p) => p._id === permission)?.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 w-full justify-end">
                <Button
                  variant="secondary"
                  className="mr-2"
                  onClick={() => {
                    setOpen(false)
                    handleDeleteRole(role._id)
                  }}
                >
                  Cancel
                </Button>
                <Button variant="purple" className="mr-5" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex  gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="m-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <PermissionClient permissions={[PERMISSIONS.EDIT_ROLE]}>
                    <CollapsibleTrigger asChild>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </CollapsibleTrigger>
                  </PermissionClient>
                  {/* <DropdownMenuItem>Duplicar</DropdownMenuItem> */}

                  <PermissionClient permissions={[PERMISSIONS.DELETE_ROLE]}>
                    <DropdownMenuItem
                      className="text-red-400"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </PermissionClient>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent>
              <div className="space-y-6">
                {error.permissions && (
                  <p className="text-red-400 text-sm">{error.permissions}</p>
                )}
                {Object.entries(permisionsGrouped).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {permissions.map((permission) => (
                        <div
                          key={permission._id}
                          className="flex items-center space-x-2 bg-black/20 p-2 rounded-md hover:bg-black/30 transition-colors"
                        >
                          <Checkbox
                            id={`${permission}`}
                            checked={rolePermissions.includes(permission._id)}
                            onCheckedChange={() => handlePermissionChange(permission._id)}
                            className="border-purple-500 data-[state=checked]:bg-purple-500"
                          />
                          <label
                            htmlFor={`${permission}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      <DialogDelete
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        id={role._id}
        url="/roles"
        title="Delete role"
        description="Are you sure you want to delete this role?"
        onAction={refreshRoles}
      />
    </>
  )
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "role":
      return <Settings className="w-4 h-4 text-purple-400" />
    case "task":
      return <FileText className="w-4 h-4 text-purple-400" />
    case "project":
      return <Layout className="w-4 h-4 text-purple-400" />
    case "user":
      return <User className="w-4 h-4 text-purple-400" />
    case "company":
      return <Building2 className="w-4 h-4 text-purple-400" />
    case "column":
      return <Columns className="w-4 h-4 text-purple-400" />
    case "dashboard":
      return <LayoutDashboard className="w-4 h-4 text-purple-400" />
    default:
      return null
  }
}
