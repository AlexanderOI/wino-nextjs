import { apiClientServer } from "@/utils/api-client-server"

import {
  Notification,
  NotificationResponse,
  GetNotificationsParams,
} from "@/features/notifications/interfaces/notification.interface"

export async function getNotifications(params: GetNotificationsParams) {
  const response = await apiClientServer.get<NotificationResponse>("/notifications", {
    params,
  })
  return response.data
}

export async function getUnreadCount() {
  const response = await apiClientServer.get<{ count: number }>(
    "/notifications/unread-count"
  )
  return response.data
}

export async function markAsRead(id: string) {
  const response = await apiClientServer.patch<Notification>(`/notifications/${id}/read`)
  return response.data
}

export async function markAllAsRead() {
  const response = await apiClientServer.patch<Notification[]>("/notifications/read")
  return response.data
}

export async function deleteNotification(id: string) {
  const response = await apiClientServer.delete<Notification>(`/notifications/${id}`)
  return response.data
}
