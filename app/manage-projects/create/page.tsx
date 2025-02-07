import { USERS_URL } from "@/constants/routes"
import FormProject from "../ui/form"
import { Project } from "@/features/project/interfaces/project.interface"
import { PROJECTS_URL } from "@/constants/routes"
import { User } from "@/features/user/interfaces/user.interface"
import { apiClientServer } from "@/utils/api-client-server"
import { TypographyH1 } from "@/components/ui/typography"

export default async function CreatePage() {
  let users: User[] = []

  const response = await apiClientServer.get<User[]>(USERS_URL)
  users = response.data

  return (
    <div className="p-6 space-y-6">
      <TypographyH1>Create New Project</TypographyH1>
      <FormProject users={users} />
    </div>
  )
}
