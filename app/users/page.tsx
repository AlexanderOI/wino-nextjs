import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { USERS_URL } from "@/constants/routes"
import { CardHeaderPage } from "@/components/common/card-header-page"
import { DialogUser } from "@/features/user/components/dialog-user"
import { DataTableUsers } from "@/features/user/components/data-table-user"
import { User } from "@/types/next-auth"
import apiClientServer from "@/utils/api-client-server"

export default async function UsersPage() {
  const response = await apiClientServer.get<User[]>(USERS_URL)
  const users = response.data

  return (
    <div className="h-full">
      <CardHeaderPage>
        <h2>User Management</h2>

        <DialogUser>
          <Button className="bg-blue-400">Create User</Button>
        </DialogUser>
      </CardHeaderPage>

      <Card className="dark:bg-dark-800 rounded h-5/6 overflow-y-auto">
        <CardContent className="h-full">
          <DataTableUsers users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
