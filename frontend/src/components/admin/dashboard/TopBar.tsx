"use client";

import { Bell, User } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query"; // Added
import { adminProfileService } from "@/services/admin.profile.service"; // Added
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

interface TopBarProps {
  pageTitle: string;
  onNavigate: (page: string) => void;
}

export default function TopBar({ pageTitle, onNavigate }: TopBarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch real profile data using the same logic as the dropdown
  const { data: profile, refetch } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: adminProfileService.getProfile,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale
  });

  // Get real unread count
  const { unreadCount } = useNotifications(true);

  // Helper to match the role display in ProfileDropdown
  const getRoleDisplay = (role?: string) => {
    if (role === "platform_admin") return "Platform Admin";
    if (role === "admin") return "Farm Owner";
    if (role === "worker") return "Worker";
    return role || "User";
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  // Convert relative avatar URL to absolute URL
  const getAvatarUrl = (avatarUrl?: string | null) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http")) return avatarUrl;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${apiBase}${avatarUrl}`;
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
              {/* Dynamic Avatar */}
              {getAvatarUrl(profile?.avatarUrl) ? (
                <img
                  key={profile?.avatarUrl}
                  src={getAvatarUrl(profile?.avatarUrl)!}
                  alt={profile.name}
                  className="w-9 h-9 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center">
                  <User size={18} className="text-white" strokeWidth={2.5} />
                </div>
              )}

              <div className="text-left">
                <div
                  className="text-[var(--admin-text-dark)] text-sm leading-tight"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  {profile?.name || "Loading..."}
                </div>
                <div
                  className="text-[var(--admin-text-muted)] text-xs"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {getRoleDisplay(profile?.role)}
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
