import Link from "next/link"
import { notFound } from "next/navigation"

import { BookMarked, Calendar, Pencil, Users } from "lucide-react"
import { format, isValid } from "date-fns"

import { apiClientServer } from "@/utils/api-client-server"
import { Project } from "@/features/project/interfaces/project.interface"
import { ColumnTask } from "@/features/tasks/interfaces/column.interface"
import { Activity } from "@/features/tasks/interfaces/activity.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

import { TASKS_URL, PROJECTS_URL } from "@/constants/routes"

import { Button, buttonVariants } from "@/components/ui/button"
import { DialogData } from "@/components/common/dialog/dialog-data"

import { PermissionServer } from "@/features/permission/permission-server"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { CardTables } from "@/features/project/components/page/card-tables"
import { CardProgress } from "@/features/project/components/page/card-progress"
import { CardDetails } from "@/features/project/components/page/card-details"
import { CardRecentActivity } from "@/features/project/components/page/card-recent-activity"
import { SelectFormDialog } from "@/features/project/components/dialog/select-form-dialog"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  let project: Project | null = null
  let tasks: Task[] = []
  let columns: ColumnTask[] = []
  let activities: Activity[] = []

  try {
    const { id } = await params
    const projectResponse = await apiClientServer.get<Project>(
      `${PROJECTS_URL}/${id}?withMembers=true`
    )
    project = {
      ...projectResponse.data,
      startDate: new Date(projectResponse.data.startDate),
      endDate: new Date(projectResponse.data.endDate),
    }

    const tasksResponse = await apiClientServer.get<Task[]>(`${TASKS_URL}/project/${id}`)
    tasks = tasksResponse.data

    const columnsResponse = await apiClientServer.get<ColumnTask[]>(
      `/columns/project/${id}`
    )
    columns = columnsResponse.data

    const resentActivitiesResponse = await apiClientServer.get<Activity[]>(
      `tasks/activity`,
      { params: { projectId: id } }
    )
    activities = resentActivitiesResponse.data
  } catch (error) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project?.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {project?.members?.length && <span>{project.members.length} members</span>}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {isValid(project?.startDate)
                  ? format(project?.startDate, "MMM dd, yyyy")
                  : "No start date"}
              </span>
            </div>
          </div>
        </div>

        <PermissionServer permissions={[PERMISSIONS.EDIT_PROJECT]}>
          <div className="flex items-center gap-2">
            <DialogData content={<SelectFormDialog />}>
              <Button variant="purple" className="gap-2">
                <BookMarked className="w-4 h-4" />
                Select Form
              </Button>
            </DialogData>

            <Link
              href={`/manage-projects/edit/${project._id}`}
              className={buttonVariants({ variant: "purple", className: "gap-2" })}
            >
              <Pencil className="w-4 h-4" />
              Edit Project
            </Link>
          </div>
        </PermissionServer>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardProgress tasks={tasks} columns={columns} />
          <CardTables tasks={tasks} project={project} />
        </div>

        <div className="space-y-6">
          <CardDetails project={project} />
          <CardRecentActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}
