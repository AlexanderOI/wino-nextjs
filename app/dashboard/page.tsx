export const dynamic = "force-dynamic"

import { BarChart3, ClipboardList } from "lucide-react"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { TypographyP, TypographyH1 } from "@/components/ui/typography"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { apiClientServer } from "@/utils/api-client-server"
import ProjectsDashboard from "@/app/dashboard/ui/projects"
import { TASKS_URL } from "@/constants/routes"
import { Project } from "@/features/project/interfaces/project.interface"
import { Activity } from "@/features/tasks/interfaces/activity.interface"

export interface ProjectWithTasks extends Project {
  tasks: Task[]
  activities: Activity[]
}

export default async function Dashboard() {
  let projects: ProjectWithTasks[] = []
  let totalTasks = 0
  try {
    const projectsResponse = await apiClientServer.get<ProjectWithTasks[]>("/projects")

    projects = projectsResponse.data

    let taskPromise = projects.map(async (project) => {
      const [tasksResponse, resentActivitiesResponse] = await Promise.all([
        apiClientServer.get<Task[]>(`${TASKS_URL}/project/${project._id}`),
        apiClientServer.get<Activity[]>(`tasks/activity`, {
          params: { projectId: project._id },
        }),
      ])

      totalTasks += tasksResponse.data.length

      project.tasks = tasksResponse.data
      project.activities = resentActivitiesResponse.data
    })

    await Promise.all(taskPromise)
  } catch (error) {
    console.error(error)
    return <div>Error loading projects</div>
  }

  const columnCounts = projects.reduce((acc, project) => {
    project.tasks?.forEach((task) => {
      const columnName = task.column.name
      acc[columnName] = (acc[columnName] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const columns = Object.entries(columnCounts).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <div className="space-y-8">
          <div>
            <TypographyH1>Dashboard</TypographyH1>
            <TypographyP className="text-gray-400">
              Track and manage your active projects and tasks
            </TypographyP>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <Card className="bg-[#1c1f2d] border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Tasks
                </CardTitle>
                <BarChart3 className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalTasks}</div>
              </CardContent>
            </Card>

            {columns.map((column, index) => (
              <Card key={index} className="bg-[#1c1f2d] border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {column.name}
                  </CardTitle>
                  <ClipboardList className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{column.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ProjectsDashboard projects={projects} />
        </div>
      </div>
    </div>
  )
}
