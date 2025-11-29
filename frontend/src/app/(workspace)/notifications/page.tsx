"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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

  // Different notifications for worker vs farmer
  const workerNotifications: Notification[] = [
    {
      id: "1",
      type: "task-assigned",
      title: "New Task Assigned",
      message:
        "You have been assigned to water Field A. Due date: Tomorrow 8:00 AM",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "2",
      type: "task-overdue",
      title: "Task Deadline Approaching",
      message: "Reminder: Fertilize Field B is due in 2 hours",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "3",
      type: "weather-alert",
      title: "Weather Alert",
      message:
        "Heavy rain expected tomorrow. Consider postponing outdoor tasks",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "4",
      type: "task-completed",
      title: "Task Completed",
      message:
        "Your task 'Inspect irrigation system' has been marked as completed",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "5",
      type: "schedule-update",
      title: "Schedule Update",
      message:
        "Your work schedule for next week has been updated by the farm manager",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  const farmerNotifications: Notification[] = [
    {
      id: "1",
      type: "field-update",
      title: "Field Status Update",
      message: "Field C irrigation system maintenance completed successfully",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "2",
      type: "harvest-schedule",
      title: "Harvest Schedule",
      message: "Tomato harvest in Field A scheduled for next Monday",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "3",
      type: "weather-alert",
      title: "Weather Forecast",
      message:
        "Favorable conditions for planting this week. Temperature 22-28°C",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "4",
      type: "worker-report",
      title: "Worker Task Completed",
      message: "Ahmed completed fertilizer application in Field B",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "5",
      type: "equipment-alert",
      title: "Equipment Alert",
      message: "Tractor #2 requires scheduled maintenance within 3 days",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "6",
      type: "schedule-update",
      title: "Crop Rotation Planning",
      message:
        "Time to plan crop rotation for Field D. Winter crops recommended",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  const initialNotifications =
    user?.role === "worker" ? workerNotifications : farmerNotifications;
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.isRead);

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

            {stats.unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-[#388E3C] transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Mark All as Read
              </button>
            )}
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
            {filteredNotifications.length === 0 ? (
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
              filteredNotifications.map((notification) => (
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
                      {notification.type
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
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
