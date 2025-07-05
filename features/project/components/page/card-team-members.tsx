import Link from "next/link"
import { Edit, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { UserAvatar } from "@/features/user/components/user-avatar"
import { User } from "@/features/user/interfaces/user.interface"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  members: User[]
  projectId: string
}

export function CardTeamMembers({ members, projectId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Team Members</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/manage-projects/edit/${projectId}`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2">
          {members.slice(0, 5).map((member) => (
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
              <Link href={`/manage-projects/edit/${projectId}`}>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    +{members.length - 5}
                  </span>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-medium">View all team members</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          {members.length} active team members
        </p>
      </CardContent>
    </Card>
  )
}
