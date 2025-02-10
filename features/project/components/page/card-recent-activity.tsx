import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity } from "@/features/tasks/interfaces/activity.interface"

interface Props {
  activities: Activity[]
}

export function CardRecentActivity({ activities }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px]">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activity.column?.color }}
                  />

                  <p className="text-sm">{activity.task?.name}</p>
                </div>

                <p className="text-xs text-muted-foreground">{activity.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
