"use client";

import React, { useEffect } from "react";
import {
  Home,
  MapPin,
  CheckSquare,
  Users,
  Cloud,
  BarChart3,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useFarmSettings } from "@/hooks/useFarmSettings"; // Service from SettingsPage

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, isActive = false, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 h-11 px-5 rounded-lg mb-1 cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-[#E8F5E9] text-[#4CAF50] border-l-[3px] border-[#4CAF50]"
          : "text-[#4B5563] hover:bg-[#F9FAFB]"
      }`}
    >
      <div className={isActive ? "text-[#4CAF50]" : "text-[#6B7280]"}>
        {icon}
      </div>
      <span className="text-[14px] font-semibold">{label}</span>
    </div>
  );
}

interface SidebarProps {
  userRole: "admin" | "worker";
  farmName?: string;
}

export function Sidebar({
  userRole,
  farmName = "Green Valley Farm",
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Fetch farm data using the same hook as the Settings page
  const { farmSettings, fetchFarmSettings } = useFarmSettings();

  useEffect(() => {
    // Initial fetch to populate the farm name in the sidebar
    fetchFarmSettings();
  }, [fetchFarmSettings]);

  // Improved active state logic to handle the /workspace/ prefix
  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <div className="w-[280px] h-full bg-white border-r border-[#E5E7EB] flex flex-col">
      {/* Logo Section */}
      <div className="p-5">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 8L8 14V26L20 32L32 26V14L20 8Z" />
              <path d="M20 8V32" />
              <path d="M8 14L20 20L32 14" />
            </svg>
          </div>
          {/* Dynamic Farm Name from Database */}
          <div className="mt-2 font-semibold text-[#6B7280] text-center px-2">
            {farmSettings?.name || farmName}
          </div>
        </div>
      </div>

      <div className="h-px bg-[#E5E7EB] mx-5 mb-2" />

      <nav className="flex-1 px-5">
        {userRole === "admin" ? (
          <>
            <NavItem
              icon={<Home size={20} strokeWidth={2} />}
              label="Dashboard"
              isActive={isActive("/dashboard")}
              onClick={() => router.push("/dashboard")}
            />
            <NavItem
              icon={<MapPin size={20} strokeWidth={2} />}
              label="Fields"
              isActive={isActive("/fields")}
              onClick={() => router.push("/fields")}
            />
            <NavItem
              icon={<CheckSquare size={20} strokeWidth={2} />}
              label="Tasks"
              isActive={isActive("/tasks")}
              onClick={() => router.push("/tasks")}
            />
            <NavItem
              icon={<Users size={20} strokeWidth={2} />}
              label="Workers"
              isActive={isActive("/workers")}
              onClick={() => router.push("/workers")}
            />
            <NavItem
              icon={<Cloud size={20} strokeWidth={2} />}
              label="Weather"
              isActive={isActive("/weather")}
              onClick={() => router.push("/weather")}
            />
            <NavItem
              icon={<Settings size={20} strokeWidth={2} />}
              label="Settings"
              isActive={isActive("/settings")}
              onClick={() => router.push("/settings")}
            />
          </>
        ) : (
          <>
            <NavItem
              icon={<Home size={20} strokeWidth={2} />}
              label="My Dashboard"
              isActive={isActive("/dashboard")}
              onClick={() => router.push("/dashboard")}
            />
            <NavItem
              icon={<CheckSquare size={20} strokeWidth={2} />}
              label="My Tasks"
              isActive={isActive("/tasks")}
              onClick={() => router.push("/tasks")}
            />
            <NavItem
              icon={<MapPin size={20} strokeWidth={2} />}
              label="Fields"
              isActive={isActive("/fields")}
              onClick={() => router.push("/fields")}
            />
            <NavItem
              icon={<Cloud size={20} strokeWidth={2} />}
              label="Weather"
              isActive={isActive("/weather")}
              onClick={() => router.push("/weather")}
            />
          </>
        )}
      </nav>

      <div className="px-5 pb-5">
        <div className="h-px bg-[#E5E7EB] mb-4" />
        <NavItem
          icon={<User size={20} strokeWidth={2} />}
          label="My Profile"
          isActive={isActive("/profile")}
          onClick={() => router.push("/profile")}
        />
        <NavItem
          icon={<HelpCircle size={20} strokeWidth={2} />}
          label="Help"
          isActive={isActive("/help")}
          onClick={() => router.push("/help")}
        />
      </div>
    </div>
  );
}