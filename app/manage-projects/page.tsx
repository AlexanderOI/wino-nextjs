import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Clock, MoreVertical, Plus, Search } from "lucide-react"
import apiClientServer from "@/utils/api-client-server"
import { Project } from "@/features/project/interfaces/project.interface"
import { PROJECTS_URL, TASKS_URL } from "@/constants/routes"

import { formatDate } from "date-fns"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownAction } from "./ui/dropdown-action"

export default async function ManageProjects() {
  const response = await apiClientServer.get<Project[]>(PROJECTS_URL)
  const projects = response.data

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your active projects
          </p>
        </div>
        <Link
          href="/manage-projects/create"
          className={buttonVariants({ variant: "purple", className: "gap-2" })}
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Link>
      </div>

      {/* <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search projects..." className="pl-10 max-w-md" />
      </div> */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  )
}

async function ProjectCard({ project }: { project: Project }) {
  const tasksResponse = await apiClientServer.get<Task[]>(
    `${TASKS_URL}/project/${project._id}`
  )
  const tasks = tasksResponse.data
  const taskCount = tasks.length

  const columns = [
    ...new Map(tasks.map((task) => [task.column._id, task.column])).values(),
  ]

  const tasksGroupedByColumn = columns.reduce((groups, column) => {
    const columnTasks = tasks.filter((task) => task.column._id === column._id)
    groups[column.name] = columnTasks
    return groups
  }, {} as Record<string, Task[]>)

  return (
    <Card className="group">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>
          <DropdownAction id={project._id} />
        </div>

        <div className="flex-grow flex flex-col justify-end">
          <div className="mt-4 flex items-center gap-4">
            <Badge className="rounded-md">{project.status}</Badge>
            <span className="text-sm text-muted-foreground">
              Client: {project.client}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <div className="bg-secondary rounded-full overflow-hidden flex w-full h-2">
              {Object.entries(tasksGroupedByColumn).map(([columnName, tasks]) => (
                <Tooltip delayDuration={100} key={columnName}>
                  <TooltipTrigger asChild>
                    <div
                      style={{
                        backgroundColor: tasks[0].column.color,
                        width: `${(tasks.length / taskCount) * 100}%`,
                      }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {tasks.length} Tasks - {columnName}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{taskCount} Tasks</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(project.startDate, "MMM d, yyyy")} -{" "}
                {formatDate(project.endDate, "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex -space-x-2 h-7">
              {project.members?.slice(0, 3).map((member, i) => (
                <Tooltip key={i} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Avatar key={i} className="w-7 h-7">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{member.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
