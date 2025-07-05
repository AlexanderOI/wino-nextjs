import { TrendingUp } from "lucide-react"
import { DonutChart } from "@/components/charts/donut-chart"
import { TypographyP } from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { ColumnTaskCount } from "@/features/tasks/actions/column.action"

interface Props {
  columns: ColumnTaskCount[]
}

export function CardProgress({ columns }: Props) {
  const totalTasks = columns.reduce((acc, column) => acc + column.tasksCount, 0)
  return (
    <Card>
      <CardHeader className="flex gap-2">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <span>Project Progress</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center gap-4 ">
              {totalTasks > 0 ? (
                <DonutChart
                  data={columns.map((column) => ({
                    name: column.name,
                    value: column.tasksCount,
                    fill: column.color,
                  }))}
                  centerText={totalTasks.toString()}
                  bottomText="Tasks"
                  className="m-0 w-1/2 h-full"
                />
              ) : (
                <div className="flex flex-col gap-4 w-5/12 h-full justify-center items-center">
                  <TypographyP className="text-sm ">No tasks in this project</TypographyP>
                </div>
              )}

              <div className="flex flex-col gap-4 w-1/2">
                {columns.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: column.color + "15" }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <span className="text-sm font-medium">{column.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: column.color + "25",
                        color: column.color,
                      }}
                    >
                      {column.tasksCount}
                    </Badge>
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
