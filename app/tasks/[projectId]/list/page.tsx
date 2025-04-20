export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"

import { Users } from "lucide-react"

import { TaskTable } from "@/features/tasks/components/list/task-table"

import { getColumnTaskCount } from "@/features/tasks/action/column.action"
import { getProject } from "@/features/project/action/project.action"
import { getAllTasks } from "@/features/tasks/action/task.action"
import { getFormTask } from "@/features/form/actions/form.action"
import { searchParamsCache, GetTasksSchema } from "@/features/tasks/lib/validations"

interface Props {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ page: string; perPage: string; sort: string }>
}

export async function getTaskData(projectId: string, filter: GetTasksSchema) {
  const {
    sort,
    page,
    perPage,
    status: columnsId,
    task: search,
    createdAt,
    assignedTo: assignedToId,
  } = filter
  const limit = perPage
  const offset = limit * (page - 1)
  const fromCreatedAt = createdAt[0] ? new Date(createdAt[0]) : undefined
  const toCreatedAt = createdAt[1] ? new Date(createdAt[1]) : undefined

  try {
    const { tasks, total } = await getAllTasks({
      sort,
      projectId,
      limit,
      offset,
      columnsId,
      search,
      fromCreatedAt,
      toCreatedAt,
      assignedToId,
    })
    const pageCount = Math.ceil(total / limit)
    return { tasks, pageCount }
  } catch (error) {
    return { tasks: [], pageCount: 0 }
  }
}

export async function getProjectFormTask(projectId: string) {
  const project = await getProject(projectId, { withMembers: true })
  const formTask = await getFormTask(project.formTaskId)
  return { project, formTask }
}

export default async function TasksPage(props: Props) {
  const { projectId } = await props.params
  const searchParams = await props.searchParams
  const filter = searchParamsCache.parse(searchParams)

  const promises = Promise.all([
    getTaskData(projectId, filter),
    getColumnTaskCount({ projectId }),
    getProjectFormTask(projectId),
  ])

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Tasks list
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your tasks and generate detailed reports
            </p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <TaskTable promises={promises} />
        </Suspense>
      </div>
    </div>
  )
}
