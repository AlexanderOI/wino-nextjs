import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { USERS_URL } from "@/constants/routes"
import { CardHeaderPage } from "@/components/common/card-header-page"
import { DialogUser } from "@/features/user/components/dialog-user"
import { DataTableUsers } from "@/features/user/components/data-table-user"
import { User } from "@/features/user/interfaces/user.interface"
import { apiClientServer } from "@/utils/api-client-server"
import { TypographyH1 } from "@/components/ui/typography"

export default async function UsersPage() {
  const response = await apiClientServer.get<User[]>(USERS_URL)
  const users = response.data

  return (
    <div className="h-full">
      <CardHeaderPage>
        <TypographyH1>Manage Users</TypographyH1>

        <DialogUser>
          <Button variant="purple">Create User</Button>
        </DialogUser>
      </CardHeaderPage>

      <Card>
        <CardContent className="h-full">
          <DataTableUsers users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
