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
      params.append("unreadOnly", String(!filters.isRead)); // Backend uses unreadOnly
    // Backend doesn't support other filters yet, but we can filter client-side if needed
    // if (filters?.type) params.append("type", filters.type);
    // if (filters?.startDate) params.append("startDate", filters.startDate);
    // if (filters?.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/admin/notifications?${params.toString()}`);
    
    // Map backend response to frontend model if needed
    // The backend returns: { id, type, title, message, timestamp, isRead }
    // We might need to add default values for missing fields like link/icon if not returned
    return response.data.map((n: any) => ({
      ...n,
      link: n.link || null,
      icon: n.icon || null,
    }));
  },

  // Get unread notifications (for dropdown)
  getUnread: async (limit?: number): Promise<Notification[]> => {
    // Backend supports unreadOnly param
    const response = await api.get("/admin/notifications?unreadOnly=true");
    let notifications = response.data.map((n: any) => ({
        ...n,
        link: n.link || null,
        icon: n.icon || null,
      }));
      
    if (limit) {
      notifications = notifications.slice(0, limit);
    }
    return notifications;
  },

  // Get notification statistics
  getStats: async (): Promise<NotificationStats> => {
    // Emulate stats by fetching all notifications
    // This is not efficient but necessary since backend lacks stats endpoint
    const response = await api.get("/admin/notifications");
    const notifications = response.data;
    
    const total = notifications.length;
    const unread = notifications.filter((n: any) => !n.isRead).length;
    
    return { total, unread };
  },

  // Mark notifications as read
  markAsRead: async (data: MarkAsReadRequest): Promise<void> => {
    // Backend doesn't support bulk update by IDs, so we loop
    // Or we can use read-all if it's for all
    // For specific IDs, we have to call markOneAsRead for each
    await Promise.all(
        data.notificationIds.map(id => api.patch(`/admin/notifications/${id}/read`))
    );
  },

  // Mark a single notification as read
  markOneAsRead: async (id: string): Promise<void> => {
    await api.patch(`/admin/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/admin/notifications/read-all");
  },

  // Delete a notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/notifications/${id}`);
  },

  // Delete multiple notifications
  deleteMany: async (ids: string[]): Promise<void> => {
    // Backend doesn't support bulk delete, so we loop
    await Promise.all(
        ids.map(id => api.delete(`/admin/notifications/${id}`))
    );
  },

  // Create a notification (admin only)
  create: async (data: CreateNotificationRequest): Promise<Notification> => {
    // This endpoint might not exist or might be different
    // Keeping it as is but pointing to /admin if it exists there
    // If it doesn't exist, this will fail
    const response = await api.post("/admin/notifications", data);
    return response.data;
  },
};
