// Notification Service - API calls for notifications

import api from "@/lib/api";
import {
  Notification,
  NotificationFilters,
  NotificationStats,
  MarkAsReadRequest,
  CreateNotificationRequest,
} from "@/types/notification.types";

// Event listeners for real-time updates
const listeners: (() => void)[] = [];

export const notificationService = {
  // Subscribe to changes
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  // Notify all listeners
  notifyListeners: () => {
    listeners.forEach((listener) => listener());
  },

  // Get all notifications for the authenticated user
  getAll: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const params = new URLSearchParams();

    if (filters?.isRead !== undefined)
      params.append("unread", String(!filters.isRead)); 

    const response = await api.get(`/userNotifications?${params.toString()}`);
    
    // Map backend response 
    return response.data.items ? response.data.items : response.data;
  },

  // Get unread notifications (for dropdown)
  getUnread: async (limit?: number): Promise<Notification[]> => {
    const response = await api.get("/userNotifications?unread=true");
    let notifications = response.data.items ? response.data.items : response.data;
      
    if (limit) {
      notifications = notifications.slice(0, limit);
    }
    return notifications;
  },

  // Get notification statistics
  getStats: async (): Promise<NotificationStats> => {
    const response = await api.get("/userNotifications");
    const notifications = response.data.items ? response.data.items : response.data;
    const unreadCount = response.data.unreadCount;
    
    return { 
      total: notifications.length, 
      unread: unreadCount !== undefined ? unreadCount : notifications.filter((n: any) => !n.isRead).length 
    };
  },

  // Mark a single notification as read
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/userNotifications/${id}/markAsRead`);
    notificationService.notifyListeners();
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/userNotifications/readAll");
    notificationService.notifyListeners();
  },

  // Delete a notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/userNotifications/${id}`);
    notificationService.notifyListeners();
  },

  // Delete all notifications
  deleteAll: async (): Promise<void> => {
    await api.delete("/userNotifications/deleteAll");
    notificationService.notifyListeners();
  },
};
