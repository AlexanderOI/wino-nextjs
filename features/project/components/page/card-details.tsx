import { FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"

import { Project } from "@/features/project/interfaces/project.interface"

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
        <div>
          <h4 className="text-sm font-medium mb-3">Project Lead</h4>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={project.leader?.avatar || ""} />
              <AvatarFallback>{project.leader?.name[0] || "No leader"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{project.leader?.name || "No leader"}</p>
              <p className="text-sm text-muted-foreground">
                {project.leader?.roleType || "No role"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
