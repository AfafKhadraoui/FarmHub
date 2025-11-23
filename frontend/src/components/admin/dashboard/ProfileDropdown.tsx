"use client";

import { User, Settings, Shield, Bell, HelpCircle, LogOut } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  icon: any;
  label: string;
  action: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  onNavigate,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
    setShowLogoutModal(false);
    onClose();
  };

  const menuItems: MenuItem[] = [
    {
      icon: User,
      label: "My Profile",
      action: () => {
        onNavigate("profile");
        onClose();
      },
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => {
        onNavigate("notifications");
        onClose();
      },
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => {
        onNavigate("help");
        onClose();
      },
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Profile Section */}
          <div className="px-5 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-gray-900 font-semibold text-base truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Dev Team
                </p>
                <p
                  className="text-gray-600 text-sm truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Platform Admin
                </p>
                <p
                  className="text-gray-400 text-xs truncate"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  dev@farmhub.com
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <IconComponent size={20} strokeWidth={2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <LogOut size={20} strokeWidth={2} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal - Rendered as Portal */}
      {isMounted &&
        showLogoutModal &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              setShowLogoutModal(false);
            }}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut size={24} className="text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Confirm Logout
                  </h3>
                </div>
              </div>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to logout? You will need to sign in again
                to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
