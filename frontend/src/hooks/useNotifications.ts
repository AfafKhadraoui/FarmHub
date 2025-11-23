import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  type: "farm" | "user" | "system" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await adminService.getNotifications();

      // MOCK DATA - Remove when backend is ready
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "farm",
          title: "New Farm Created",
          message:
            "A new farm 'Sunset Valley' has been registered by ahmed@email.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false,
        },
        {
          id: "2",
          type: "user",
          title: "User Milestone Reached",
          message:
            "Platform reached 1,000 registered users! Congratulations on this achievement.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: false,
        },
      ];

      setNotifications(mockNotifications);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await adminService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      // await adminService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await adminService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      console.error("Error deleting notification:", err);
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
    refetch: fetchNotifications,
  };
}
