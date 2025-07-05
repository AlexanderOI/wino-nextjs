export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"

import { Users } from "lucide-react"

import { TaskTable } from "@/features/tasks/components/list/task-table"

import { getColumnTaskCount } from "@/features/tasks/actions/column.action"
import { searchParamsCache } from "@/features/tasks/lib/validations"
import { getProjectFormTask, getTaskData } from "@/features/tasks/actions/task.action"

interface Props {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ page: string; perPage: string; sort: string }>
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
