"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfileDropdown } from "./ProfileDropdown";

import { notificationService } from "@/services/notification.service";

interface TopBarProps {
  userRole?: "admin" | "worker";
}

export function TopBar({ userRole = "worker" }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { profile } = useProfile();

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Determine if user is admin
  const isAdmin = profile?.role?.toLowerCase() === "admin";

  const fetchUnreadCount = async () => {
    try {
      const stats = await notificationService.getStats();
      setUnreadCount(stats.unread);
    } catch (error) {
      console.error("Failed to fetch notification stats:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const unsubscribe = notificationService.subscribe(fetchUnreadCount);
    return () => unsubscribe();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = () => {
    if (!user) return "User";
    return user.role === "admin" ? "Farm Admin" : "Worker";
  };

  return (
    <div className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8">
      {/* Left - Empty space */}
      <div className="flex-1" />

      {/* Center - Search Bar */}
      <div className="relative w-[400px]">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
          size={20}
        />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setShowSearch(true)}
          className="w-full h-11 pl-12 pr-4 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#4CAF5019] transition-all cursor-pointer"
        />
      </div>

      {/* Right - Notifications + Profile */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Notification Bell */}
        <div
          ref={bellRef}
          className="relative cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={24} className="text-[#4B5563]" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          )}
          <NotificationsPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            triggerRef={bellRef as React.RefObject<HTMLElement>}
            onUpdate={fetchUnreadCount}
          />
        </div>

        {/* Profile Section */}
        <div
          ref={profileRef}
          className="relative flex items-center gap-3 cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#4CAF50] to-[#81C784] flex items-center justify-center">
            <span className="text-white font-bold">
              {getInitials(profile?.name || user?.name)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#1F2937]">
              {profile?.name || user?.name || "User"}
            </span>
            <span className="text-[13px] text-[#6B7280]">{getUserRole()}</span>
          </div>
          <ProfileDropdown
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            triggerRef={profileRef as React.RefObject<HTMLElement>}
            userName={profile?.name || user?.name}
            userRole={getUserRole()}
            userEmail={profile?.email || user?.email}
            userInitials={getInitials(profile?.name || user?.name)}
            userRoleType={isAdmin ? "admin" : "worker"}
          />
        </div>
      </div>
    </div>
  );
}
