import { TypographyH1 } from "@/components/ui/typography"
import { NotificationsList } from "@/features/notifications/notification-list"

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH1>Notifications</TypographyH1>
          <p className="text-muted-foreground mt-1">
            Here you can see all the notifications you have received
          </p>
        </div>
      </div>

      <NotificationsList />
    </div>
  )
}
