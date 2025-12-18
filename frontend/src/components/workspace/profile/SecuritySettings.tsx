// components/profile/SecuritySettings.tsx
import React from "react";
import { Lock, LogOut } from "lucide-react";

interface SecuritySettingsProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

export const SecuritySettings = ({ onChangePassword, onLogout }: SecuritySettingsProps) => (
  <div className="mb-8">
    <h2 className="font-semibold text-[#1F2937] mb-5 text-[20px]" style={{ fontFamily: "Poppins, sans-serif" }}>
      Security & Privacy
    </h2>
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
      <div className="space-y-4">
        {/* Password Section */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-[#3B82F6]" />
            </div>
            <div>
              <div className="font-semibold text-[#1F2937] text-[15px]">Password</div>
              <div className="text-[#6B7280] text-[13px]">Update your password</div>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all"
          >
            Change Password
          </button>
        </div>

        {/* Logout Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <LogOut size={20} className="text-[#EF4444]" />
            </div>
            <div>
              <div className="font-semibold text-[#1F2937] text-[15px]">Logout</div>
              <div className="text-[#6B7280] text-[13px]">Sign out of your account</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="h-10 px-5 bg-[#EF4444] text-white rounded-lg font-semibold hover:bg-[#DC2626] transition-all flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);