export interface Notification {
  _id: string
  title: string
  description: string
  read: boolean
  link?: string
  createdAt: Date
  updatedAt: Date
}

export interface NotificationResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

export interface GetNotificationsParams {
  limit: number
  page: number
  search?: string
  startDate?: string
  endDate?: string
}
