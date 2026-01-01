"use client";

import React, { useState } from "react";
import { Modal } from "@/components/workspace/modals/Modal";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { changePassword } = useProfile();

  const handleSubmit = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      onError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      onError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      onError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmationPassword: confirmPassword,
      });

      if (res && res.success) {
        onSuccess(res.data?.message || "Password changed successfully!");
        handleClose();
      } else {
        onError(res?.error || "Failed to change password");
      }
    } catch (err: any) {
      onError(err?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      width="500px"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={loading}
            className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </>
      }
    >
      <div className="space-y-5 py-2">
        {/* Current Password */}
        <div>
          <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
            <Lock size={16} />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full h-11 px-4 pr-12 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
            <Lock size={16} />
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full h-11 px-4 pr-12 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-[#9CA3AF] text-[12px] mt-1">
            Must be at least 8 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
            <Lock size={16} />
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-11 px-4 pr-12 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};