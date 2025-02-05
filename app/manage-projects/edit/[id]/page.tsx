import { USERS_URL } from "@/constants/routes"
import FormProject from "../../ui/form"
import { Project } from "@/features/project/interfaces/project.interface"
import { PROJECTS_URL } from "@/constants/routes"
import { User } from "@/features/user/interfaces/user.interface"
import apiClientServer from "@/utils/api-client-server"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: Props) {
  const { id } = await params

  let users: User[] = []
  let project: Project | undefined = undefined

  try {
    const response = await apiClientServer.get<User[]>(USERS_URL)
    users = response.data

    if (id) {
      const projectResponse = await apiClientServer.get<Project>(
        `${PROJECTS_URL}/${id}?withMembers=true`
      )
      project = projectResponse.data
    }
  } catch (error) {
    notFound()
  }

  return (
    <div className="p-6 flex flex-col gap-4 items-start justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Edit Project</h1>
      </div>
      <FormProject users={users} project={project} />
    </div>
  )
}
