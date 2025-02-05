import { USERS_URL } from "@/constants/routes"
import FormProject from "../ui/form"
import { Project } from "@/features/project/interfaces/project.interface"
import { PROJECTS_URL } from "@/constants/routes"
import { User } from "@/features/user/interfaces/user.interface"
import apiClientServer from "@/utils/api-client-server"

export default async function CreatePage() {
  let users: User[] = []

  const response = await apiClientServer.get<User[]>(USERS_URL)
  users = response.data

  return (
    <div className="p-6 flex flex-col gap-4 items-start justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Create New Project</h1>
      </div>
      <FormProject users={users} />
    </div>
  )
}
