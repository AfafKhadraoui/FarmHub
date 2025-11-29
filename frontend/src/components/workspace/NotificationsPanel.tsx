import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus,
  Bell,
  X,
  Check,
} from "lucide-react";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

interface Notification {
  id: number;
  type:
    | "task-assigned"
    | "task-completed"
    | "help-request"
    | "worker-joined"
    | "task-overdue";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  triggerRef,
}: NotificationsPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "task-assigned",
      title: "New Task Assigned",
      message: "You have been assigned to water Field A",
      time: "5 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      type: "task-overdue",
      title: "Task Deadline Approaching",
      message: "Fertilize Field B is due in 2 hours",
      time: "30 minutes ago",
      isRead: false,
    },
    {
      id: 3,
      type: "task-completed",
      title: "Task Completed",
      message: "Your task 'Inspect irrigation system' was marked as completed",
      time: "2 hours ago",
      isRead: true,
    },
    {
      id: 4,
      type: "help-request",
      title: "Weather Alert",
      message: "Heavy rain expected tomorrow. Check task schedule",
      time: "5 hours ago",
      isRead: true,
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task-assigned":
        return <CheckCircle size={20} className="text-[#2196F3]" />;
      case "task-completed":
        return <CheckCircle size={20} className="text-[#4CAF50]" />;
      case "help-request":
        return <AlertCircle size={20} className="text-[#FF9800]" />;
      case "worker-joined":
        return <UserPlus size={20} className="text-[#4CAF50]" />;
      case "task-overdue":
        return <Clock size={20} className="text-[#EF4444]" />;
    }
  };

  const getNotificationBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "task-assigned":
        return "bg-[#E3F2FD]";
      case "task-completed":
        return "bg-[#E8F5E9]";
      case "help-request":
        return "bg-[#FFF3E0]";
      case "worker-joined":
        return "bg-[#E8F5E9]";
      case "task-overdue":
        return "bg-[#FFEBEE]";
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-[400px] max-h-[600px] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl z-50 flex flex-col animate-fadeIn"
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      {/* Header */}
      <div className="p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3
              className="font-bold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "18px" }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="w-6 h-6 bg-[#EF4444] text-white rounded-full flex items-center justify-center text-[12px] font-semibold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[#4CAF50] text-[14px] font-medium hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("all");
            }}
            className={`pb-2 font-medium text-[14px] border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-[#4CAF50] text-[#4CAF50]"
                : "border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
            }`}
          >
            All
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("unread");
            }}
            className={`pb-2 font-medium text-[14px] border-b-2 transition-colors ${
              activeTab === "unread"
                ? "border-[#4CAF50] text-[#4CAF50]"
                : "border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Bell size={64} className="text-[#D1D5DB] mb-4" />
            <p className="text-[#6B7280] font-medium mb-2">
              No new notifications
            </p>
            <p className="text-[#9CA3AF] text-[14px]">You're all caught up!</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer ${
                !notification.isRead ? "bg-[#F8F9FA]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 ${getNotificationBgColor(
                    notification.type
                  )} rounded-full flex items-center justify-center shrink-0`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#2196F3] rounded-full mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[#1F2937] text-[14px]">
                        {notification.title}
                      </p>
                      <p className="text-[#6B7280] text-[13px] mt-1">
                        {notification.message}
                      </p>
                      <p className="text-[#9CA3AF] text-[12px] mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:text-[#4CAF50] hover:bg-[#E8F5E9] rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FFEBEE] rounded transition-colors"
                    title="Delete"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {displayedNotifications.length > 0 && (
        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            onClick={() => {
              router.push("/notifications");
              onClose();
            }}
            className="w-full text-center text-[#4CAF50] font-medium text-[14px] hover:underline"
          >
            View All Notifications →
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
