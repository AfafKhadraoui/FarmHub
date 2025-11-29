"use client";

import { Bell, Check, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(filter === "unread");

  const filteredNotifications = notifications;

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
    switch (type) {
      case "farm":
        return "bg-green-100 text-green-700";
      case "user":
        return "bg-blue-100 text-blue-700";
      case "system":
        return "bg-purple-100 text-purple-700";
      case "alert":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            Stay updated with platform activities
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Settings size={18} strokeWidth={2} />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Preferences
          </span>
        </button>
      </div>

      {/* Stats and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4baf47] to-[#ff6b00] flex items-center justify-center">
                <Bell size={24} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {unreadCount}
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Unread notifications
                </p>
              </div>
            </div>

            <div className="h-12 w-px bg-gray-200" />

            <div>
              <p
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {notifications.length}
              </p>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Total notifications
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#4baf47] text-white rounded-lg hover:bg-[#3d9639] transition-colors"
            >
              <Check size={18} strokeWidth={2} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Mark all as read
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-[#4baf47] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-[#4baf47] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#4baf47] border-t-transparent rounded-full mx-auto mb-4" />
            <p
              className="text-gray-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-red-500" />
            </div>
            <p
              className="text-red-900 font-semibold text-lg mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Error loading notifications
            </p>
            <p
              className="text-red-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {error}
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <p
              className="text-gray-900 font-semibold text-lg mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              No notifications
            </p>
            <p
              className="text-gray-500"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {filter === "unread"
                ? "You're all caught up!"
                : "No notifications to display"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                notification.isRead
                  ? "border-gray-200"
                  : "border-[#4baf47] border-l-4"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          notification.type
                        )}`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </span>
                      <span
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {getRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <h3
                      className="text-gray-900 font-semibold text-base mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {notification.title}
                    </h3>
                    <p
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-[#4baf47] hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} strokeWidth={2} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
