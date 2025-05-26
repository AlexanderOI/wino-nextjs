import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query"

import { useSocket } from "@/hooks/use-socket"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { updateQueryParams } from "@/lib/update-query-params"

import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/features/notifications/actions/notification.action"
import {
  Notification,
  GetNotificationsParams,
  NotificationResponse,
} from "@/features/notifications/interfaces/notification.interface"

export function useNotification(params?: Partial<GetNotificationsParams>) {
  const { on } = useSocket()
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchParamsState, setSearchParamsState] = useState<
    Partial<GetNotificationsParams>
  >({
    limit: 5,
    page: 1,
    search: searchParams.get("search") || "",
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    ...params,
  })

  const notificationQuery = useInfiniteQuery<NotificationResponse>({
    queryKey: ["notifications", searchParamsState],
    queryFn: ({ pageParam, queryKey }) => {
      const [, searchParams] = queryKey
      const params = searchParams as GetNotificationsParams
      params.page = pageParam as number
      return getNotifications(params)
    },
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.total > pages.length ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  const unreadCountQuery = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCount,
  })

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
    queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] })
  }, [queryClient])

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: invalidateNotifications,
  })

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidateNotifications,
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: invalidateNotifications,
  })

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id)
  }

  const handleDeleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const updateSearchParams = useCallback(
    (params: Partial<GetNotificationsParams>) => {
      const { limit, page, ...rest } = params
      const queryString = updateQueryParams(searchParams, rest)
      router.push(`${pathname}?${queryString}`)
    },
    [searchParams, pathname, router]
  )

  const debouncedSetSearchParams = useDebouncedCallback(
    (params: Partial<GetNotificationsParams>) => {
      setSearchParamsState((prev) => ({
        ...prev,
        ...params,
        page: 1,
      }))
      updateSearchParams(params)
    },
    300
  )

  const handleSearch = (search: string) => {
    debouncedSetSearchParams({ search })
  }

  const handleDateFilter = (startDate?: string, endDate?: string) => {
    debouncedSetSearchParams({ startDate, endDate })
  }

  useEffect(() => {
    on("notification", (notification: Notification) => {
      invalidateNotifications()
    })
  }, [on, invalidateNotifications])

  return {
    notificationQuery,
    unreadCountQuery,
    markAsReadMutation,
    deleteNotificationMutation,
    markAllAsReadMutation,
    handleMarkAsRead,
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleSearch,
    handleDateFilter,
  }
}
