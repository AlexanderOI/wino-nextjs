import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Users, UserPlus, Mail, Activity, UserPlus2 } from "lucide-react"
import { UserCompanyTable } from "@/features/user/components/user-company-table"
import { User } from "@/features/user/interfaces/user.interface"
import { apiClientServer } from "@/utils/api-client-server"
import { PermissionServer } from "@/features/permission/permission-server"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { DialogCreateUser } from "@/features/user/components/dialog/dialog-create-user"
import { DialogInviteUser } from "@/features/user/components/dialog/dialog-invite-user"
import { DialogData } from "@/components/common/dialog/dialog-data"
export default async function UsersPage() {
  const users = await apiClientServer.get<User[]>("/users")

  let usersCompany: User[] = users.data.filter((user) => !user.isInvited)
  let usersGuests: User[] = users.data.filter((user) => user.isInvited)

  let usersGuestsPending = usersGuests.filter((user) => user.invitePending).length

  const stats = [
    { title: "Total Users", value: users.data.length, icon: Users },
    {
      title: "Active Users",
      value: usersCompany.length,
      icon: Activity,
    },
    {
      title: "Invited Users",
      value: usersGuests.length - usersGuestsPending,
      icon: UserPlus2,
    },
    {
      title: "Invitation Pending",
      value: usersGuestsPending,
      icon: Mail,
    },
  ]

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Manage Users
            </h1>
            <p className="text-gray-400 mt-1">Manage users and their permissions</p>
          </div>

          <div className="flex gap-2">
            <PermissionServer permissions={[PERMISSIONS.CREATE_USER]}>
              <DialogData content={<DialogCreateUser />}>
                <Button variant="purple">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogData>
            </PermissionServer>

            <DialogInviteUser>
              <Button variant="purple">
                <UserPlus2 className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogInviteUser>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <UserCompanyTable usersCompany={usersCompany} usersGuests={usersGuests} />
      </div>
    </div>
  )
}
