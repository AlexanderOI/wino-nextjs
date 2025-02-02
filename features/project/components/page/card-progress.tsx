import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ColumnTask } from "@/features/tasks/interfaces/column.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

interface Props {
  tasks: Task[]
  columns: ColumnTask[]
}

export function CardProgress({ tasks, columns }: Props) {
  const tasksGroupedByColumn = columns.reduce((groups, column) => {
    const columnTasks = tasks.filter((task) => task.column._id === column._id)
    groups[column.name] = columnTasks
    return groups
  }, {} as Record<string, Task[]>)

  return (
    <Card>
      <CardHeader className="flex gap-2">
        <CardTitle className="text-lg font-medium">Project Progress</CardTitle>
        <CardDescription>State count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
            </div>
            <Progress value={65} />
          </div>
          <div className="flex justify-between gap-4 pt-4">
            {Object.entries(tasksGroupedByColumn).map(([columnName, tasks]) => (
              <div key={columnName}>
                <h3 className="text-lg font-medium">{columnName}</h3>
                <p>{tasks.length} tasks</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
