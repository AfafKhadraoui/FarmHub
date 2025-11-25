"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

interface TopBarProps {
  pageTitle: string;
  onNavigate: (page: string) => void;
}

export default function TopBar({ pageTitle, onNavigate }: TopBarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sample unread count (in real app, get from notifications state)
  const unreadCount = 2;

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); // Close profile if open
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false); // Close notifications if open
  };

  return (
    <div className="fixed top-0 right-0 left-[280px] h-[80px] bg-white border-b border-[var(--admin-border)] shadow-sm z-40">
      <div className="flex items-center justify-between h-full px-8">
        {/* Page Title */}
        <h2
          className="text-[var(--admin-text-dark)] text-2xl"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
        >
          {pageTitle}
        </h2>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-[300px] h-[44px] pl-10 pr-4 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] placeholder-[var(--admin-text-muted)] bg-[var(--admin-bg-gray)] focus:border-[var(--admin-primary)] outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-[var(--admin-bg-gray)] transition-colors"
            >
              <Bell size={20} className="text-[var(--admin-text-muted)]" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              onNavigate={onNavigate}
            />
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--admin-bg-gray)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center">
                <User size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <div
                  className="text-[var(--admin-text-dark)] text-sm leading-tight"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Admin User
                </div>
                <div
                  className="text-[var(--admin-text-muted)] text-xs"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Platform Admin
                </div>
              </div>
            </button>
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
