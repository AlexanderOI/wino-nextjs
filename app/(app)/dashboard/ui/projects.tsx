"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TypographyH2 } from "@/components/ui/typography"

import { CardRecentActivity } from "@/features/project/components/page/card-recent-activity"
import { ProjectWithTasks } from "@/app/(app)/dashboard/page"
import { CardProgress } from "@/features/project/components/page/card-progress"
import { ColumnTaskCount } from "@/features/tasks/actions/column.action"

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
        <CardProgress columns={currentProject?.columnsTasks || []} />

        <CardRecentActivity activities={currentProject?.activities || []} />
      </div>
    </>
  )
}
