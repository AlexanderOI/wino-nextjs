import { CardHeaderPage } from "@/components/common/card-header-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyH1 } from "@/components/ui/typography"
import { PROJECTS_URL } from "@/constants/routes"
import DataTableUsersTeam from "@/features/project/components/users-team-table"
import { Project } from "@/features/project/intefaces/project.inteface"
import apiClientServer from "@/utils/api-client-server"
import { notFound } from "next/navigation"

//params es asigcrono en next 15
interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  let project: Project | null = null

  try {
    const { id } = await params
    const projectResponse = await apiClientServer.get<Project>(`${PROJECTS_URL}/${id}`)
    project = projectResponse.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="h-full">
      <CardHeaderPage>
        <TypographyH1>Project: {project.name}</TypographyH1>
      </CardHeaderPage>

      <Card className="dark:bg-dark-800 rounded h-5/6 overflow-y-auto">
        <CardContent className="h-full">
          <DataTableUsersTeam users={project.usersTeam} />
        </CardContent>
      </Card>
    </div>
  )
}
