import { Task } from "@/app/tasks/[projectId]/page"
import { CardHeaderPage } from "@/components/common/card-header-page"
import { Card, CardContent } from "@/components/ui/card"
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography"
import { PROJECTS_URL, TASKS_URL } from "@/constants/routes"
import DataTableUsersTeam from "@/features/project/components/users-team-table"
import { Project } from "@/features/project/intefaces/project.inteface"
import apiClientServer from "@/utils/api-client-server"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  let project: Project | null = null
  let tasks: Task[] = []

  try {
    const { id } = await params
    const projectResponse = await apiClientServer.get<Project>(`${PROJECTS_URL}/${id}`)
    project = projectResponse.data

    const tasksResponse = await apiClientServer.get<Task[]>(`${TASKS_URL}/project/${id}`)
    tasks = tasksResponse.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="h-full">
      <CardHeaderPage>
        <TypographyH1>Project: {project.name}</TypographyH1>
      </CardHeaderPage>

      <div className="flex gap-4">
        <Card className="w-8/12">
          <CardContent className="h-full">
            <DataTableUsersTeam users={project.usersTeam} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 w-4/12">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4">
                <TypographyH2>Project: {project.name}</TypographyH2>
                <TypographyP>Description: {project.description}</TypographyP>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent>
              <div className="flex flex-col gap-4">
                <TypographyH2>Recent Tasks</TypographyH2>

                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="flex justify-between gap-2">
      <div>
        <TypographyP>{task.name}</TypographyP>
        <TypographyP className="text-sm">{task.description}</TypographyP>
      </div>
      <div>
        <TypographyP>{task.assignedTo?.name}</TypographyP>
        <TypographyP>{task.columnId.name}</TypographyP>
      </div>
    </div>
  )
}
