import { USERS_URL } from "@/constants/routes"
import FormProject from "../../ui/form"
import { Project } from "@/features/project/interfaces/project.interface"
import { PROJECTS_URL } from "@/constants/routes"
import { User } from "@/features/user/interfaces/user.interface"
import { apiClientServer } from "@/utils/api-client-server"
import { notFound } from "next/navigation"
import { TypographyH1 } from "@/components/ui/typography"

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
    <div className="p-6 space-y-6">
      <TypographyH1>Edit Project</TypographyH1>
      <FormProject users={users} project={project} />
    </div>
  )
}
