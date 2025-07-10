"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TypographyH2 } from "@/components/ui/typography"
import { DonutChart } from "@/components/charts/donut-chart"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { CardRecentActivity } from "@/features/project/components/page/card-recent-activity"
import { ProjectWithTasks } from "@/app/dashboard/page"

interface Props {
  projects?: ProjectWithTasks[]
}

export default function ProjectsDashboard({ projects }: Props) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const currentProject = projects?.[currentProjectIndex]

  const handlePrevProject = () => {
    if (!projects) return
    setCurrentProjectIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : projects.length - 1
    )
  }

  const handleNextProject = () => {
    if (!projects) return
    setCurrentProjectIndex((prevIndex) =>
      prevIndex < projects.length - 1 ? prevIndex + 1 : 0
    )
  }

  const tasks = currentProject?.columnsTasks

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
        <TypographyH2>{currentProject?.name ?? "No existing project"}</TypographyH2>
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
            {tasks && tasks.length > 0 ? (
              <>
                <DonutChart
                  data={currentProject?.columnsTasks.map((column) => ({
                    name: column.name,
                    value: column.tasksCount,
                    fill: column.color,
                  }))}
                  centerText={currentProject?.columnsTasks
                    .reduce((acc, column) => acc + column.tasksCount, 0)
                    .toString()}
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

        <CardRecentActivity activities={currentProject?.activities || []} />
      </div>
    </>
  )
}
