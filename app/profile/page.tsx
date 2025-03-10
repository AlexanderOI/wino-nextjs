import { subDays } from "date-fns"

import { getSession } from "@/utils/get-session"
import { apiClientServer } from "@/utils/api-client-server"
import { User } from "@/features/user/interfaces/user.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/features/profile/user-avatar"
import { TypographyH1 } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"

import EditDialog from "@/features/profile/edit-dialog"
import { USERS_URL } from "@/constants/routes"

export default async function ProfilePage() {
  const session = await getSession()
  const user = session?.user

  const response = await apiClientServer.get<User>(`${USERS_URL}/${user?._id}`)
  const userData = response.data

  const responseTasks = await apiClientServer.get<Task[]>(`tasks`, {
    params: {
      assignedToId: userData?._id,
      toUpdatedAt: new Date().toISOString(),
      fromUpdatedAt: subDays(new Date(), 30).toISOString(),
    },
  })

  const tasks = responseTasks.data

  const columns = [
    ...new Map(tasks?.map((task) => [task.column._id, task.column])).values(),
  ]

  const tasksGroupedByColumn = columns?.reduce((groups, column) => {
    const columnTasks = tasks?.filter((task) => task.column._id === column._id)
    groups[column.name] = columnTasks
    return groups
  }, {} as Record<string, Task[] | undefined>)

  return (
    <div className="min-h-screen  text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <TypographyH1>User Profile</TypographyH1>
        </div>

        {/* Main Profile Card */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader className="flex flex-row justify-between gap-4 pb-2 space-y-0">
              <div className="flex items-center gap-4">
                <UserAvatar user={user} />
                <div>
                  <CardTitle className="text-xl">{user?.name}</CardTitle>
                  <p className="text-gray-400">{user?.email}</p>

                  <Badge variant="purple" className="mt-2">
                    {userData?.roleType}
                  </Badge>
                </div>
              </div>

              <EditDialog user={userData} />
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <div className="grid gap-2 text-sm text-gray-400">
                    <p>Username: {userData?.userName}</p>
                    <p>Email: {userData?.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Permissions and Access</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {userData?.roles.map((role) => (
                      <Badge key={role} variant="outline" className="justify-start p-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">My tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks?.length > 0 ? (
                    columns?.map((column) => (
                      <div key={column._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: column.color }}
                          />

                          <span className="text-sm">{column.name}</span>
                        </div>
                        <Badge variant="purple">
                          {tasksGroupedByColumn?.[column.name]?.length}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No activities found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
