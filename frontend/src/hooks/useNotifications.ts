import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import type { Notification } from "@/services/adminService";

export function useNotifications(unreadOnly: boolean = false) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getNotifications(unreadOnly);
      // Convert timestamp strings to Date objects for compatibility
      const notificationsWithDates = data.map((n) => ({
        ...n,
        timestamp: new Date(n.timestamp) as any, // Keep as Date for backward compatibility
      }));
      setNotifications(notificationsWithDates);
      setError(null);
    } catch (err: any) {
      // If 403 (Forbidden), it means user is not admin. Return empty list instead of error.
      if (err.response && err.response.status === 403) {
        setNotifications([]);
        setError(null);
      } else {
        setError(err.message || "Failed to fetch notifications");
        console.error("Error fetching notifications:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [unreadOnly]);

  useEffect(() => {
    fetchNotifications();

    // Listen for global notification updates
    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener("notification-update", handleUpdate);
    return () => window.removeEventListener("notification-update", handleUpdate);
  }, [fetchNotifications]);

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event("notification-update"));
  };

  const markAsRead = async (id: string) => {
    try {
      await adminService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      dispatchUpdate();
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await adminService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      dispatchUpdate();
      return result.count;
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await adminService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      dispatchUpdate();
    } catch (err: any) {
      console.error("Error deleting notification:", err);
      throw err;
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await adminService.deleteAllNotifications();
      setNotifications([]);
      dispatchUpdate();
    } catch (err: any) {
      console.error("Error deleting all notifications:", err);
      throw err;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refetch: fetchNotifications,
  };
}
