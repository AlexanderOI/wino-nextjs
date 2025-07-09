import { notFound } from "next/navigation"
import { getProject } from "@/features/project/actions/project.action"
import { getColumnsWithTasks } from "@/features/tasks/actions/column.action"
import { TasksPageClient } from "@/features/tasks/components/board/page-client"

export default async function TasksPageServer({
  params,
}: {
  params: { projectId: string }
}) {
  const projectId = params.projectId

  const project = await getProject(projectId)

  if (!project) {
    return notFound()
  }

  const columnsTasks = await getColumnsWithTasks(projectId)

  return <TasksPageClient project={project} columnsTasks={columnsTasks} />
}
