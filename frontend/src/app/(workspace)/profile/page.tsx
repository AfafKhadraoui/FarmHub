"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/context/ProfileContext";
import { CustomAlert } from "@/components/workspace/CustomAlert";
import { ChangePasswordModal } from "@/components/workspace/modals/ChangePasswordModal";
import { ProfileHeader } from "@/components/workspace/profile/ProfileHeader";
import { ProfileCard } from "@/components/workspace/profile/ProfileCard";
import { PerformanceStats } from "@/components/workspace/profile/PerformanceStats";
import { SecuritySettings } from "@/components/workspace/profile/SecuritySettings";
import { LogoutModal } from "@/components/workspace/modals/LogoutModal";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading, error, refresh, update, changePassword } = useProfile();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [alert, setAlert] = useState({ isOpen: false, type: "success" as "success" | "error", message: "" });

  // Initialize profile data
  useEffect(() => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      phone: profile.phone || ""
    });

  }, [profile]);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await update({
        name: formData.name,
        phone: formData.phone
      });

      if (res.success) {
        showAlert("success", "Profile updated successfully!");
        await refresh();
        setIsEditing(false);
      } else {
        showAlert("error", res.error || "Failed to update");
      }
    } catch {
      showAlert("error", "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: profile?.name || "", phone: profile?.phone || "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-white border rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 max-w-3xl mx-auto text-center">
        <div className="mb-4 text-red-600">Failed to load profile: {error}</div>
        <button onClick={refresh} className="h-10 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all">
          Retry
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const isWorker = profile.role?.toLowerCase() === 'worker';

  return (
    <>
      <ProfileHeader />

      <ProfileCard
        profile={profile}
        isEditing={isEditing}
        saving={saving}
        formData={formData}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onFormChange={setFormData}
      />

      {isWorker && <PerformanceStats profile={profile} />}

      <SecuritySettings
        onChangePassword={() => setShowChangePasswordModal(true)}
        onLogout={() => setShowLogoutModal(true)}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={(msg) => showAlert("success", msg)}
        onError={(msg) => showAlert("error", msg)}
      />

      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        type={alert.type}
        message={alert.message}
      />
    </>
  );
}