export const dynamic = "force-dynamic"
export const revalidate = 0

import { BarChart3, ClipboardList } from "lucide-react"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { TypographyP, TypographyH1 } from "@/components/ui/typography"
import { apiClientServer } from "@/utils/api-client-server"
import ProjectsDashboard from "@/app/(app)/dashboard/ui/projects"
import { Project } from "@/features/project/interfaces/project.interface"
import { Activity } from "@/features/tasks/interfaces/activity.interface"
import {
  ColumnTaskCount,
  getColumnTaskCount,
} from "@/features/tasks/actions/column.action"
import { getRecentActivities } from "@/features/tasks/actions/activity.action"
import { getProjects } from "@/features/project/actions/project.action"

export interface ProjectWithTasks extends Project {
  columnsTasks: ColumnTaskCount[]
  activities: Activity[]
}

export default async function Dashboard() {
  let projects: ProjectWithTasks[] = []
  let totalTasks = 0
  try {
    const { projects: projectsResponse } = await getProjects({ limit: 100 })

    projects = projectsResponse as ProjectWithTasks[]

    let taskPromise = projects.map(async (project) => {
      const [columns, resentActivitiesResponse] = await Promise.all([
        getColumnTaskCount({ projectId: project._id }),
        getRecentActivities({ projectId: project._id }),
      ])

      totalTasks += columns.reduce((acc, column) => acc + column.tasksCount, 0)

      project.activities = resentActivitiesResponse
      project.columnsTasks = columns
    })

    await Promise.all(taskPromise)
  } catch (error) {
    console.error(error)
    return <div>Error loading projects</div>
  }

  const columnsTotalCount = projects
    .map((project) => project.columnsTasks)
    .flat()
    .reduce((acc, column) => {
      if (acc[column.name]) {
        acc[column.name] += column.tasksCount
      } else {
        acc[column.name] = column.tasksCount
      }
      return acc
    }, {} as { [name: string]: number })

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

            {Object.entries(columnsTotalCount).map(([name, tasksCount], index) => (
              <Card key={name} className="bg-[#1c1f2d] border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {name}
                  </CardTitle>
                  <ClipboardList className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{tasksCount}</div>
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
