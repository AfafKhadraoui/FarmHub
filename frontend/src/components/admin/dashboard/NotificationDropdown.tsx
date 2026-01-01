"use client";

import { Store, Award, Download, AlertCircle, X, Check } from "lucide-react";
import { useRef, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

interface Notification {
  id: string;
  type: "farm" | "user" | "system" | "alert";
  title: string;
  message: string;
  timestamp: Date | string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}
// ... (keeping imports and helpers)

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Store,
    Award,
    Download,
    AlertCircle,
  };
  return icons[iconName] || Store;
};

const getIconColor = (type: string) => {
  const colors = {
    farm: "bg-green-100 text-green-600",
    user: "bg-blue-100 text-blue-600",
    system: "bg-purple-100 text-purple-600",
    alert: "bg-orange-100 text-orange-600",
  };
  return colors[type as keyof typeof colors] || colors.farm;
};

const getRelativeTime = (date: Date | string) => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export default function NotificationDropdown({
  isOpen,
  onClose,
  onNavigate,
}: NotificationDropdownProps) {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead: markAllNotificationsAsRead,
  } = useNotifications(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    onClose();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 3);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3
          className="text-gray-900 text-base font-semibold"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[#4baf47] text-sm font-medium hover:text-[#3d9639] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div
        className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-gray-100 hover:scrollbar-thumb-gray-200"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "white #f3f4f6",
        }}
      >
        {notifications.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Check size={28} className="text-gray-400" />
            </div>
            <p
              className="text-gray-900 font-semibold mb-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              No new notifications
            </p>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              You're all caught up!
            </p>
          </div>
        ) : (
          displayedNotifications.map((notification, index) => {
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  index !== displayedNotifications.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className="text-gray-900 font-semibold text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#4baf47] shrink-0 mt-1" />
                      )}
                    </div>
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => {
              onNavigate("notifications");
              onClose();
            }}
            className="w-full text-center text-[#4baf47] text-sm font-medium hover:text-[#3d9639] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            View All Notifications →
          </button>
        </div>
      )}
    </div>
  );
}
