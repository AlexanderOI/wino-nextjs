"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"
import {
  Building2,
  Search,
  Shield,
  UserCog,
  Users,
  UserX,
  Lock,
  Trash,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { apiClient } from "@/utils/api-client"
import { cn } from "@/lib/utils"
import { User } from "@/features/user/interfaces/user.interface"

import { TableAction } from "@/components/common/table-action"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { DialogConfirm } from "@/components/common/dialog/dialog-confirm"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { DataTable } from "@/components/ui/datatable/DataTable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

import { DialogChangeRole } from "@/features/user/components/dialog/dialog-change-role"
import { DialogEditUser } from "@/features/user/components/dialog/dialog-edit-user"
import { DialogChangePassword } from "@/features/user/components/dialog/dialog-change-password"
import { UserAvatar } from "@/features/user/components/user-avatar"

interface Props {
  usersCompany: User[]
  usersGuests: User[]
}

type ModalAction<T> = {
  type:
    | "edit"
    | "delete"
    | "change-role"
    | "change-password"
    | "toggle-active"
    | "cancel-invitation"
  data: T
}

export const UserCompanyTable = ({ usersCompany, usersGuests }: Props) => {
  const router = useRouter()
  const [modalAction, setModalAction] = useState<ModalAction<User> | null>(null)

  const [filterText, setFilterText] = useState("")

  const handleToggleActiveConfirm = async () => {
    try {
      const isActive = modalAction?.data?.isActive

      await apiClient.patch(`/users/${modalAction?.data?._id}`, {
        isActive: !isActive,
      })

      toast({
        title: "User updated",
        description: "User status has been updated successfully",
        duration: 1000,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        duration: 1000,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="flex justify-between gap-4 w-full bg-transparent p-0">
          <div className="w-1/2">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search user..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-9 m-0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 bg-transparent rounded-sm h-full w-6/12">
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-purple-light hover:bg-purple-light rounded-sm w-1/2 border"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Company Users
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="data-[state=active]:bg-purple-light hover:bg-purple-light rounded-sm w-1/2 border"
            >
              <Users className="w-4 h-4 mr-2" />
              Invited Users
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="company" className="mt-6">
          <Card>
            <DataTable
              columns={Columns(setModalAction)}
              data={usersCompany}
              options={{
                inputSearch: false,
                valueGlobalFilter: filterText,
              }}
            />
          </Card>
        </TabsContent>
        <TabsContent value="guests" className="mt-6">
          <Card>
            <DataTable
              columns={Columns(setModalAction)}
              data={usersGuests}
              options={{
                inputSearch: false,
                valueGlobalFilter: filterText,
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <DialogData
        isOpen={modalAction?.type === "edit"}
        onOpenChange={() => setModalAction(null)}
        content={<DialogEditUser id={modalAction?.data?._id || ""} />}
      />

      <DialogData
        isOpen={modalAction?.type === "change-role"}
        onOpenChange={() => setModalAction(null)}
        content={<DialogChangeRole id={modalAction?.data?._id || ""} />}
      />

      <DialogData
        isOpen={modalAction?.type === "change-password"}
        onOpenChange={() => setModalAction(null)}
        content={<DialogChangePassword id={modalAction?.data?._id || ""} />}
      />

      <DialogDelete
        id={modalAction?.data?._id || ""}
        url="/users"
        isOpen={modalAction?.type === "delete"}
        onOpenChange={() => setModalAction(null)}
        title="Delete User"
        description="Are you sure you want to delete this user?"
      />

      <DialogConfirm
        isOpen={modalAction?.type === "toggle-active"}
        onOpenChange={() => setModalAction(null)}
        onConfirm={handleToggleActiveConfirm}
        title={`${modalAction?.data?.isActive ? "Disable" : "Enable"} User`}
        description={`Are you sure you want to ${
          modalAction?.data?.isActive ? "disable" : "enable"
        } the user?`}
      />

      <DialogDelete
        id={modalAction?.data?._id || ""}
        url="/users"
        isOpen={modalAction?.type === "cancel-invitation"}
        onOpenChange={() => setModalAction(null)}
        title="Cancel Invitation"
        description="Are you sure you want to cancel this invitation?"
        buttonText="Cancel Invitation"
        toastSuccess={{
          title: "Invitation Cancelled",
          description: "The invitation has been cancelled successfully",
          variant: "default",
          id: modalAction?.data?._id || "",
        }}
      />
    </>
  )
}

const Columns = (setModalAction: (action: ModalAction<User>) => void) => {
  const columns: ColumnDef<User>[] = [
    {
      id: "user",
      accessorFn: (row) => `${row.name} ${row.email}`,
      header: () => <div className="text-center">User</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <UserAvatar user={row.original} className="h-10 w-10" />

          <div>
            <div className="font-semibold flex items-center gap-2">
              {row.original.name}
              {row.original.isInvited && (
                <Badge variant="outline" className="ml-2">
                  {row.original.invitePending ? "Invitation Pending" : "Invited"}
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: () => <div>User Name</div>,
      cell: ({ row }) => <div>{row.original.userName}</div>,
    },
    {
      accessorKey: "roleType",
      header: () => <div className="text-center">Position in the company</div>,
      cell: ({ row }) => <div className="text-center">{row.original.roleType}</div>,
    },
    {
      id: "isActive",
      accessorFn: (row) => (row.isActive ? "Active" : "Inactive"),
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            className={cn(
              row.getValue("isActive") === "Active"
                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            )}
          >
            {row.getValue("isActive")}
          </Badge>
        </div>
      ),
    },

    {
      accessorKey: "roles",
      header: () => <div className="text-center">Roles</div>,
      cell: ({ row }) => (
        <div className="text-center flex flex-wrap gap-2">
          {row.original.roles.map((role) => (
            <Badge key={role} variant="purple">
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Date Added</div>,
      cell: ({ row }) => (
        <div className="text-center">{format(row.original.createdAt, "PPP")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <TableAction>
          {!row.original.invitePending && (
            <>
              <DropdownMenuItem
                onClick={() => setModalAction({ type: "edit", data: row.original })}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setModalAction({ type: "change-role", data: row.original })
                }
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={row.original.isInvited}
                onClick={() =>
                  setModalAction({ type: "change-password", data: row.original })
                }
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn(row.original.isActive ? "text-red-400" : "text-green-400")}
                onClick={() =>
                  setModalAction({ type: "toggle-active", data: row.original })
                }
              >
                <UserX className="w-4 h-4 mr-2" />
                {row.original.isActive ? "Disable User" : "Enable User"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400"
                onClick={() => setModalAction({ type: "delete", data: row.original })}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </>
          )}

          {row.original.isInvited && row.original.invitePending && (
            <DropdownMenuItem
              className="text-red-400"
              onClick={() =>
                setModalAction({ type: "cancel-invitation", data: row.original })
              }
            >
              <UserX className="w-4 h-4 mr-2" />
              Cancel Invitation
            </DropdownMenuItem>
          )}
        </TableAction>
      ),
    },
  ]

  return columns
}
