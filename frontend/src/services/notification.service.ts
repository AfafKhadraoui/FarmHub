// Notification Service - API calls for notifications

import api from "@/lib/api";
import {
  Notification,
  NotificationFilters,
  NotificationStats,
  MarkAsReadRequest,
  CreateNotificationRequest,
} from "@/types/notification.types";

export const notificationService = {
  // Get all notifications for the authenticated user
  getAll: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const params = new URLSearchParams();

    if (filters?.isRead !== undefined)
      params.append("isRead", String(filters.isRead));
    if (filters?.type) params.append("type", filters.type);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },

  // Get unread notifications (for dropdown)
  getUnread: async (limit?: number): Promise<Notification[]> => {
    const params = limit ? `?limit=${limit}` : "";
    const response = await api.get(`/api/notifications/unread${params}`);
    return response.data;
  },

  // Get notification statistics
  getStats: async (): Promise<NotificationStats> => {
    const response = await api.get("/api/notifications/stats");
    return response.data;
  },

  // Mark notifications as read
  markAsRead: async (data: MarkAsReadRequest): Promise<void> => {
    await api.patch("/api/notifications/read", data);
  },

  // Mark a single notification as read
  markOneAsRead: async (id: string): Promise<void> => {
    await api.patch(`/api/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/api/notifications/read-all");
  },

  // Delete a notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/notifications/${id}`);
  },

  // Delete multiple notifications
  deleteMany: async (ids: string[]): Promise<void> => {
    await api.delete("/api/notifications/bulk", { data: { ids } });
  },

  // Create a notification (admin only)
  create: async (data: CreateNotificationRequest): Promise<Notification> => {
    const response = await api.post("/api/notifications", data);
    return response.data;
  },
};
