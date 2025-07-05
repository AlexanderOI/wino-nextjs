import Link from "next/link"
import { notFound } from "next/navigation"

import { BookMarked, Calendar, Pencil, Users } from "lucide-react"
import { format, isValid } from "date-fns"

import { Button, buttonVariants } from "@/components/ui/button"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { PermissionServer } from "@/features/permission/permission-server"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

import { SelectFormDialog } from "@/features/project/components/dialog/select-form-dialog"
import { CardProgress } from "@/features/project/components/page/card-progress"
import { CardDetails } from "@/features/project/components/page/card-details"
import { CardRecentActivity } from "@/features/project/components/page/card-recent-activity"
import { CardTeamMembers } from "@/features/project/components/page/card-team-members"

import { getRecentActivities } from "@/features/tasks/actions/activity.action"
import { getColumnTaskCount } from "@/features/tasks/actions/column.action"
import { getProject } from "@/features/project/actions/project.action"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params

  const [project, columns, activities] = await Promise.all([
    getProject(id, { withMembers: true }),
    getColumnTaskCount({ projectId: id }),
    getRecentActivities({ projectId: id }),
  ])

  if (!project) return notFound()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {project.members?.length && <span>{project.members.length} members</span>}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {isValid(project.startDate)
                  ? format(project.startDate, "MMM dd, yyyy")
                  : "No start date"}
              </span>
            </div>
          </div>
        </div>

        <PermissionServer permissions={[PERMISSIONS.EDIT_PROJECT]}>
          <div className="flex items-center gap-2">
            <DialogData content={<SelectFormDialog />}>
              <Button variant="purple" className="gap-2">
                <BookMarked className="w-4 h-4" />
                Select Form
              </Button>
            </DialogData>

            <Link
              href={`/manage-projects/edit/${project._id}`}
              className={buttonVariants({ variant: "purple", className: "gap-2" })}
            >
              <Pencil className="w-4 h-4" />
              Edit Project
            </Link>
          </div>
        </PermissionServer>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardProgress columns={columns} />
          <CardRecentActivity activities={activities} />
        </div>

        <div className="space-y-6">
          <CardDetails project={project} />
          <CardTeamMembers members={project.members || []} projectId={project._id} />
        </div>
      </div>
    </div>
  )
}
