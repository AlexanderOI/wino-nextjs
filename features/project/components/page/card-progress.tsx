import { DonutChart } from "@/components/charts/donut-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TypographyP } from "@/components/ui/typography"
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
        <CardTitle className="text-lg font-medium text-center w-full">
          Project Progress
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-center items-center gap-4 ">
              {tasks.length > 0 ? (
                <DonutChart
                  data={columns.map((column) => ({
                    name: column.name,

                    value: tasksGroupedByColumn[column.name].length ?? 0,
                    fill: column.color,
                  }))}
                  centerText={tasks.length.toString()}
                  bottomText="Tasks"
                  className="m-0 w-5/12 h-full"
                />
              ) : (
                <div className="flex flex-col gap-4 w-5/12 h-full justify-center items-center">
                  <TypographyP className="text-sm ">No tasks</TypographyP>
                </div>
              )}
              <div className="flex flex-col gap-4">
                {Object.entries(tasksGroupedByColumn).map(([columnName, tasks]) => (
                  <div key={columnName} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: columns.find(
                          (column) => column.name === columnName
                        )?.color,
                      }}
                    />
                    <TypographyP className="text-sm">
                      {columnName} ( {tasks.length} )
                    </TypographyP>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
