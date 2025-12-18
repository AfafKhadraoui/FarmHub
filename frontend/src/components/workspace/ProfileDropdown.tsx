import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { User, Settings, Lock, Bell, HelpCircle, LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Modal } from "./modals/Modal";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  userName?: string;
  userRole?: string;
  userEmail?: string;
  userInitials?: string;
  userRoleType?: "admin" | "worker";
}

export function ProfileDropdown({
  isOpen,
  onClose,
  triggerRef,
  userName = "Ahmed Khalil",
  userRole = "Farm Admin",
  userEmail = "ahmed@email.com",
  userInitials = "AK",
  userRoleType = "worker",
}: ProfileDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { profile } = useProfile();
  const isAdmin = userRoleType === "admin" || profile?.role?.toLowerCase() === "admin";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("accessToken");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl z-50 animate-fadeIn overflow-hidden"
        style={{ animation: "fadeIn 0.2s ease" }}
      >
        {/* Header - User Info */}
        <div className="p-5 border-b border-[#E5E7EB] bg-linear-to-br from-[#E8F5E9] to-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center text-white font-bold text-[22px] shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1F2937] text-[16px] truncate">
                {userName}
              </h3>
              <p className="text-[#6B7280] text-[13px] truncate">{userRole}</p>
              <p className="text-[#9CA3AF] text-[12px] truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={() => {
              router.push("/profile");
              onClose();
            }}
            className="w-full h-11 px-5 flex items-center gap-3 text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <User size={20} className="text-[#6B7280]" />
            <span className="text-[13px] font-semibold">My Profile</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                router.push("/settings");
                onClose();
              }}
              className="w-full h-11 px-5 flex items-center gap-3 text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <Settings size={20} className="text-[#6B7280]" />
              <span className="text-[13px] font-semibold">Account Settings</span>
            </button>
          )}

          <button
            onClick={() => {
              router.push("/security");
              onClose();
            }}
            className="w-full h-11 px-5 flex items-center gap-3 text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <HelpCircle size={20} className="text-[#6B7280]" />
            <span className="text-[13px] font-semibold">Security</span>
          </button>

          <button
            onClick={() => {
              router.push("/notifications");
              onClose();
            }}
            className="w-full h-11 px-5 flex items-center gap-3 text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <Bell size={20} className="text-[#6B7280]" />
            <span className="text-[13px] font-semibold">Notifications</span>
          </button>

          <button
            onClick={() => {
              router.push("/help");
              onClose();
            }}
            className="w-full h-11 px-5 flex items-center gap-3 text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <HelpCircle size={20} className="text-[#6B7280]" />
            <span className="text-[13px] font-semibold">Help & Support</span>
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-[#E5E7EB] my-1" />

        {/* Logout */}
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="w-full h-11 px-5 flex items-center gap-3 text-[#F44336] hover:bg-[#FFEBEE] transition-colors"
          >
            <LogOut size={20} />
            <span className="text-[13px] font-semibold">Logout</span>
          </button>
        </div>

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

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title=""
        width="400px"
        showCloseButton={false}
        footer={
          <>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="h-11 px-6 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all"
            >
              Logout
            </button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mx-auto mb-5">
            <LogOut size={36} className="text-[#FF9800]" />
          </div>

          <h2
            className="font-bold text-[#1F2937] mb-4"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
          >
            Logout?
          </h2>

          <p className="text-[#6B7280]">Are you sure you want to logout?</p>
        </div>
      </Modal>
    </>
  );
}
