import { Activity } from "@/features/tasks/interfaces/activity.interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ActivityIcon, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Props {
  activities: Activity[]
}

export function CardRecentActivity({ activities }: Props) {
  const height = activities.length > 3 ? 390 : activities.length * 130
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ActivityIcon className="w-5 h-5 text-green-600" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: `${height}px` }}>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start space-x-4 p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: activity.column?.color || "#f59e0b",
                  background: activity.column?.color + "15",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activity.column?.color || "#f59e0b" }}
                >
                  <div className="w-4 h-4 rounded-full bg-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {activity.task?.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {activity.text}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(activity.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
