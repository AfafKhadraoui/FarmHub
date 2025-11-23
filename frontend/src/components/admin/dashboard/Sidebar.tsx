"use client";

import { LayoutDashboard, Store, Users, BarChart3 } from "lucide-react";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "farms", label: "Farms", icon: Store },
  { id: "users", label: "All Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[var(--admin-border)] shadow-sm z-50">
      {/* Logo */}
      <div className="h-[80px] px-6 flex items-center border-b border-[var(--admin-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center shadow-md">
            <Store size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              className="text-[var(--admin-text-dark)] text-xl leading-tight"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}
            >
              FarmHub
            </h1>
            <p
              className="text-[var(--admin-text-muted)] text-xs"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Platform Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "text-[#4baf47] bg-[#4baf47]/10 border-l-[3px] border-[#4baf47] shadow-sm"
                    : "text-[#878680] hover:bg-gray-50 hover:text-[#1f1e17]"
                }`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                <Icon size={20} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
