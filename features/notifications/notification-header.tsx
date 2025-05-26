"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { useNotification } from "@/features/notifications/hooks/use-notification"
import { Notification } from "@/features/notifications/interfaces/notification.interface"

export function NotificationHeader() {
  const { notificationQuery, unreadCountQuery, handleMarkAsRead, handleMarkAllAsRead } =
    useNotification()
  const { data } = notificationQuery
  const { data: unreadCountData } = unreadCountQuery

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? []
  const unreadCount = unreadCountData?.count ?? 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative w-10 h-10 m-0 [&_svg]:size-5">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-[1px] -right-[1px] flex h-4 max-w-6 px-1 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "flex gap-3 p-3 border-b last:border-0 transition-colors cursor-pointer",
                    !notification.read && "bg-gray-800"
                  )}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(notification.createdAt), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">You have no notifications</div>
          )}
        </div>
        <div className="p-2 border-t">
          <Link
            href={"/notifications"}
            className={cn(
              buttonVariants({ variant: "ghost", className: "p-0 w-full h-8 text-sm" })
            )}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
