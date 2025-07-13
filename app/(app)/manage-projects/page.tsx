import Link from "next/link"

import { formatDate } from "date-fns"
import { Clock, Plus } from "lucide-react"

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TypographyH1 } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"

import { PermissionServer } from "@/features/permission/permission-server"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { UserAvatar } from "@/features/user/components/user-avatar"
import { Project } from "@/features/project/interfaces/project.interface"
import { getColumnTaskCount } from "@/features/tasks/actions/column.action"

import { DropdownAction } from "@/features/manage-projects/components/dropdown-action"
import { SearchProjects } from "@/features/manage-projects/components/projects-search"
import { ProjectPagination } from "@/features/manage-projects/components/projects-paginacion"
import { getProjects } from "@/features/project/actions/project.action"
import { searchParamsCache } from "@/features/manage-projects/lib/validations"

interface Props {
  searchParams: Promise<{
    search?: string
    limit?: string
    page?: string
  }>
}

export default async function ManageProjects({ searchParams }: Props) {
  const searchParamsData = await searchParams
  const filter = searchParamsCache.parse(searchParamsData)
  console.log(filter)

  const response = await getProjects(filter)
  const projects = response.projects
  const total = response.total
  const totalPages = Math.ceil(total / filter.limit)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH1>Manage Projects</TypographyH1>
          <p className="text-muted-foreground mt-1">
            Track and manage your active projects
          </p>
        </div>

        <PermissionServer permissions={[PERMISSIONS.CREATE_PROJECT]}>
          <Link
            href="/manage-projects/create"
            className={buttonVariants({ variant: "purple", className: "gap-2" })}
          >
            <Plus className="w-4 h-4" />
            Create Project
          </Link>
        </PermissionServer>
      </div>

      <SearchProjects initialSearch={filter.search} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {totalPages > 1 && (
        <ProjectPagination
          total={total}
          currentPage={filter.page}
          totalPages={totalPages}
          limit={filter.limit}
        />
      )}
    </div>
  )
}

async function ProjectCard({ project }: { project: Project }) {
  const columns = await getColumnTaskCount({ projectId: project._id })

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
          <PermissionServer
            permissions={[PERMISSIONS.EDIT_PROJECT, PERMISSIONS.DELETE_PROJECT]}
          >
            <DropdownAction id={project._id} />
          </PermissionServer>
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
              {columns.map((column) => (
                <Tooltip delayDuration={100} key={column.name}>
                  <TooltipTrigger asChild>
                    <div
                      style={{
                        backgroundColor: column.color,
                        width: `${(column.tasksCount / column.tasksCount) * 100}%`,
                      }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {column.tasksCount} Tasks - {column.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {columns.reduce((acc, column) => acc + column.tasksCount, 0)} Tasks
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs">
                {formatDate(project.startDate, "MMM d, yyyy")} -{" "}
                {formatDate(project.endDate, "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex -space-x-2">
              {project.members?.slice(0, 3).map((member) => (
                <Tooltip key={member._id} delayDuration={0}>
                  <TooltipTrigger>
                    <UserAvatar key={member._id} user={member} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/manage-projects/edit/${project._id}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        +{project.members?.length ? project.members.length - 3 : 0}
                      </span>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">View all team members</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
