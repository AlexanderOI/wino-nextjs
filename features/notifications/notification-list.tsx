"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Bell, Check, Search, Trash2, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { useNotification } from "@/features/notifications/hooks/use-notification"
import { NotificationSkeleton } from "@/features/notifications/notification-skeleton"
import Link from "next/link"
import { NotificationResponse } from "./interfaces/notification.interface"

const uniqueNotifications = (notifications: NotificationResponse[]) => {
  return (
    notifications
      .flatMap((page) => page.notifications)
      .filter(
        (notification, index, self) =>
          index === self.findIndex((n) => n._id === notification._id)
      ) ?? []
  )
}

export function NotificationsList() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const initialStartDate = searchParams.get("startDate") || undefined
  const initialEndDate = searchParams.get("endDate") || undefined

  const {
    notificationQuery,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleSearch,
    handleDateFilter,
  } = useNotification()

  const { data } = notificationQuery
  const total = data?.pages[0].total ?? 0
  const notifications = uniqueNotifications(data?.pages ?? [])
  const uniqueNotificationsCount =
    data?.pages.flatMap((page) => page.notifications).length ?? 0
  const unreadCount = data?.pages[0].unreadCount ?? 0

  const [searchValue, setSearchValue] = useState(initialSearch)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialStartDate && initialEndDate
      ? {
          from: new Date(initialStartDate),
          to: new Date(initialEndDate),
        }
      : undefined
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    handleSearch(value)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    handleDateFilter(range?.from?.toISOString(), range?.to?.toISOString())
  }

  const handleClearSearch = () => {
    setSearchValue("")
    handleSearch("")
  }

  const handleClearDateRange = () => {
    setDateRange(undefined)
    handleDateFilter(undefined, undefined)
  }

  const hasActiveFilters = searchValue || dateRange?.from || dateRange?.to

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-500" />
          <span className="font-medium">
            {unreadCount}{" "}
            {unreadCount === 1 ? "unread notification" : "unread notifications"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleClearSearch()
                handleClearDateRange()
              }}
            >
              Clear filters
            </Button>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-4 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search notifications..."
            className="pl-8 pr-8"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <DateRangePicker onSelect={handleDateRangeChange} value={dateRange} />
          {dateRange?.from && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={handleClearDateRange}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification._id} className="p-4 transition-colors">
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={notification.link || ""}
                      className={cn(
                        "flex items-center gap-2 font-medium cursor-default",
                        notification.link && "cursor-pointer hover:text-purple-500"
                      )}
                    >
                      {notification.link ? (
                        <span className="bg-purple-500 size-3 rounded-full" />
                      ) : (
                        <span className="bg-gray-500 size-3 rounded-full" />
                      )}
                      {notification.title}
                    </Link>
                    {!notification.read && (
                      <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{notification.description}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {format(new Date(notification.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="h-8 w-8"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNotification(notification._id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {uniqueNotificationsCount < total && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => notificationQuery.fetchNextPage()}
                disabled={notificationQuery.isFetchingNextPage}
              >
                {notificationQuery.isFetchingNextPage ? "Loading..." : "Load more..."}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          {notificationQuery.isLoading && <NotificationSkeleton />}

          <Card className="p-8 text-center text-gray-500">
            <p>You have no notifications</p>
          </Card>
        </>
      )}
    </div>
  )
}
