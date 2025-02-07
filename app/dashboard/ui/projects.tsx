"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { TypographyH2 } from "@/components/ui/typography"
import { ProjectWithTasks } from "../page"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { DonutChart } from "@/components/charts/donut-chart"

interface Props {
  projects: ProjectWithTasks[]
}

export default function ProjectsDashboard({ projects }: Props) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const currentProject = projects[currentProjectIndex]

  const handlePrevProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : projects.length - 1
    )
  }

  const handleNextProject = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex < projects.length - 1 ? prevIndex + 1 : 0
    )
  }

  const tasks = currentProject.tasks

  const columns = [
    ...new Map(tasks.map((task) => [task.column._id, task.column])).values(),
  ]

  const tasksGroupedByColumn = columns.reduce((groups, column) => {
    const columnTasks = tasks.filter((task) => task.column._id === column._id)
    groups[column.name] = columnTasks
    return groups
  }, {} as Record<string, Task[]>)

  return (
    <>
      <div className="relative flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10"
          onClick={handlePrevProject}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <TypographyH2>{currentProject.name}</TypographyH2>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10"
          onClick={handleNextProject}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-col items-center pb-0">
            <TypographyH2>Tasks by column</TypographyH2>
          </CardHeader>

          <CardContent className="flex-1 py-0">
            {tasks.length > 0 ? (
              <>
                <DonutChart
                  data={columns.map((column) => ({
                    name: column.name,
                    value: tasksGroupedByColumn[column.name].length,
                    fill: column.color,
                  }))}
                  centerText={tasks.length.toString()}
                  bottomText="Tasks"
                />

                <div className="flex flex-col items-center gap-2 text-sm mb-4">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Tasks
                  </div>

                  <div className="leading-none text-muted-foreground">
                    Showing total tasks
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground mt-4">
                No tasks yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1c1f2d] border-0">
          <CardHeader className="flex flex-col items-center pb-0">
            <TypographyH2>Recent activities</TypographyH2>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              {currentProject.activities.length > 0 ? (
                currentProject.activities.map((activity, index) => (
                  <div key={index} className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: activity.task.column.color }}
                      />

                      <p className="text-sm">{activity.task.name}</p>
                    </div>

                    <p className="text-xs text-muted-foreground">{activity.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No activities yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
