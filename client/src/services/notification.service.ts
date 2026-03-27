import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";

export const NotificationService = {
  
  getAll: (page: number = 1, limit: number = 20) =>
    api.get(ENDPOINTS.NOTIFICATIONS.LIST, {
      params: { page, limit },
    }),

  getUnreadCount: () =>
    api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),

  
  markAsRead: (id: string) =>
    api.patch(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id)),

  markAllAsRead: () =>
    api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ),
};