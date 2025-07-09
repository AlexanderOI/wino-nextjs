import { FileText } from "lucide-react"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"

import { Project } from "@/features/project/interfaces/project.interface"
import { UserAvatar } from "@/features/user/components/user-avatar"

interface Props {
  project: Project
}

export function CardDetails({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Project Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm text-muted-foreground">
            {project.description || "No description"}
          </p>
        </div>
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <UserAvatar user={project.leader} className="w-10 h-10" />
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {project.leader?.name || "No leader"}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.leader?.roleType || "No role"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
