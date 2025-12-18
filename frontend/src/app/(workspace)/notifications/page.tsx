"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { notificationService } from "@/services/notification.service";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // If filter is unread, pass isRead: false
      const data = await notificationService.getAll(
        filter === "unread" ? { isRead: false } : undefined
      );
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = notificationService.subscribe(fetchNotifications);
    return () => unsubscribe();
  }, [filter]);

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await notificationService.deleteAll();
      setNotifications([]);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  };


  const getRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      "task-assigned": "bg-blue-100 text-blue-700",
      "task-overdue": "bg-red-100 text-red-700",
      "task-completed": "bg-green-100 text-green-700",
      "task-updated": "bg-blue-100 text-blue-700",
      "field-update": "bg-purple-100 text-purple-700",
      "weather-alert": "bg-orange-100 text-orange-700",
      system: "bg-gray-100 text-gray-700",
      "harvest-schedule": "bg-green-100 text-green-700",
      "equipment-alert": "bg-yellow-100 text-yellow-700",
      "worker-report": "bg-indigo-100 text-indigo-700",
      "schedule-update": "bg-purple-100 text-purple-700",
    };
    return colorMap[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Notifications
          </h1>
          <p
            className="text-gray-600 mt-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Stay updated with your tasks and activities
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#4baf47] to-[#388E3C] flex items-center justify-center">
                  <Bell size={24} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-2xl font-bold text-gray-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {stats.unread}
                  </p>
                  <p
                    className="text-sm text-gray-600"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Unread
                  </p>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-200" />

              <div>
                <p
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {stats.total}
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Total
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {stats.unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-[#388E3C] transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Mark All as Read
                </button>
              )}
              {notifications.length > 0 && (
                 <button
                 onClick={handleDeleteAll}
                 className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                 style={{ fontFamily: "Inter, sans-serif" }}
               >
                 <Trash2 size={18} />
                 Delete All
               </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  filter === "all"
                    ? "text-[#4CAF50] border-b-2 border-[#4CAF50]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  filter === "unread"
                    ? "text-[#4CAF50] border-b-2 border-[#4CAF50]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Unread
                {stats.unread > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[#4CAF50] text-white rounded-full text-xs">
                    {stats.unread}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
               <div className="p-12 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell size={48} className="text-gray-300 mx-auto mb-3" />
                <p
                  className="text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? "bg-[#F8F9FA]" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Badge */}
                    <div
                      className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold ${getTypeColor(
                        notification.type
                      )}`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {notification.type}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-gray-900 mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className="text-gray-600 text-sm mb-2"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {notification.message}
                      </p>
                      <p
                        className="text-gray-400 text-xs"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {getRelativeTime(notification.timestamp)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-[#4CAF50] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
