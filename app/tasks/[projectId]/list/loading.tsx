import { Users } from "lucide-react"
import { TasksPageLoading } from "@/features/tasks/components/list/page-skeleton"

export default function TasksListPageLoading() {
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

        <TasksPageLoading />
      </div>
    </div>
  )
}
