"use client";


import React, { useState, useEffect } from "react";
import { Modal } from "@/components/workspace/modals/Modal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  Shield,
  Bell,
  Lock,
  CheckCircle,
  Clock,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Mock data matching API response for Admin
const mockAdminProfile = {
  id: 1,
  name: "Green Valley Owner",
  email: "owner@example.com",
  phone: "+213 555 000 000",
  role: "admin",
  farmId: 1,
  farmName: "Green Valley Farm",
  createdAt: "2024-01-01T00:00:00.000Z",
};

// Mock data matching API response for Worker
const mockWorkerProfile = {
  id: 3,
  name: "Ahmed Khalil",
  email: "ahmed@email.com",
  phone: "+213 555 123 456",
  role: "worker",
  status: "active",
  joinedAt: "2024-01-15T00:00:00.000Z",
  performancePercent: 95,
  assignedTasksCount: 5,
  completedTasksCount: 42,
  recentTasks: [
    {
      id: 601,
      title: "Water North Field",
      status: "completed",
      fieldName: "North Field",
      completedAt: "2025-11-27T09:30:00.000Z",
    },
    {
      id: 598,
      title: "Harvest Wheat",
      status: "completed",
      fieldName: "Field A",
      completedAt: "2025-11-26T14:20:00.000Z",
    },
    {
      id: 595,
      title: "Soil Preparation",
      status: "completed",
      fieldName: "South Field",
      completedAt: "2025-11-25T11:15:00.000Z",
    },
  ],
};

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  farmId?: number;
  farmName?: string;
  joinedAt?: string;
  createdAt?: string;
  performancePercent?: number;
  assignedTasksCount?: number;
  completedTasksCount?: number;
  recentTasks?: Array<{
    id: number;
    title: string;
    status: string;
    fieldName: string;
    completedAt: string;
  }>;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Use mock data based on user role (default to worker for demo)
  const mockProfile =
    user?.role === "admin" ? mockAdminProfile : mockWorkerProfile;

  const [profileData] = useState<ProfileData>(mockProfile);

  // Form state
  const [formData, setFormData] = useState({
    name: mockProfile.name,
    phone: mockProfile.phone,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: profileData.name,
      phone: profileData.phone,
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("accessToken");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatRecentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const isAdmin = profileData.role === "admin";
  const isWorker = profileData.role === "worker";

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="font-bold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
        >
          My Profile
        </h1>
        <p className="mt-2 text-[#6B7280]">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm mb-8">
        {/* Cover Section */}
        <div className="h-32 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] rounded-t-2xl relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-[#9CA3AF]" />
                )}
              </div>

              {/* Camera Button */}
              {isEditing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#388E3C] transition-all shadow-lg"
                >
                  <Camera size={20} className="text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2
                className="font-bold text-[#1F2937] mb-2"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
              >
                {profileData.name}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1 ${
                    isAdmin
                      ? "bg-[#E8F5E9] text-[#4CAF50]"
                      : "bg-[#DBEAFE] text-[#3B82F6]"
                  }`}
                >
                  <Shield size={14} />
                  {profileData.role.charAt(0).toUpperCase() +
                    profileData.role.slice(1)}
                </span>
                {isWorker && profileData.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
                      profileData.status === "active"
                        ? "bg-[#E8F5E9] text-[#4CAF50]"
                        : "bg-[#FEE2E2] text-[#EF4444]"
                    }`}
                  >
                    {profileData.status.charAt(0).toUpperCase() +
                      profileData.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Edit/Save Buttons */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="h-10 px-6 bg-white border border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1F2937] text-[15px]">{profileData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                <Mail size={16} />
                Email Address
              </label>
              <p className="text-[#1F2937] text-[15px]">{profileData.email}</p>
              <p className="text-[#9CA3AF] text-[12px] mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-[#1F2937] text-[15px]">{profileData.phone}</p>
              )}
            </div>

            {/* Joined Date */}
            <div>
              <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                <Calendar size={16} />
                Member Since
              </label>
              <p className="text-[#1F2937] text-[15px]">
                {formatDate(profileData.joinedAt || profileData.createdAt)}
              </p>
            </div>

            {/* Farm Name (Admin only) */}
            {isAdmin && profileData.farmName && (
              <div>
                <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                  <MapPin size={16} />
                  Farm Name
                </label>
                <p className="text-[#1F2937] text-[15px]">
                  {profileData.farmName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Stats - Worker Only */}
      {isWorker && (
        <div className="mb-8">
          <h2
            className="font-semibold text-[#1F2937] mb-5"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
          >
            Performance Overview
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center mb-3">
                <CheckCircle size={24} className="text-[#4CAF50]" />
              </div>
              <div className="text-[#6B7280] text-[14px] mb-1">
                Tasks Completed
              </div>
              <div
                className="font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
              >
                {profileData.completedTasksCount || 0}
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center mb-3">
                <Clock size={24} className="text-[#F59E0B]" />
              </div>
              <div className="text-[#6B7280] text-[14px] mb-1">
                Assigned Tasks
              </div>
              <div
                className="font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
              >
                {profileData.assignedTasksCount || 0}
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center mb-3">
                <TrendingUp size={24} className="text-[#3B82F6]" />
              </div>
              <div className="text-[#6B7280] text-[14px] mb-1">Performance</div>
              <div
                className="font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
              >
                {profileData.performancePercent || 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks - Worker Only */}
      {isWorker && profileData.recentTasks && profileData.recentTasks.length > 0 && (
        <div className="mb-8">
          <h2
            className="font-semibold text-[#1F2937] mb-5"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
          >
            Recent Tasks
          </h2>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="space-y-4">
              {profileData.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === "completed"
                          ? "bg-[#4CAF50]"
                          : task.status === "in_progress"
                          ? "bg-[#F59E0B]"
                          : "bg-[#9CA3AF]"
                      }`}
                    />
                    <div>
                      <div className="text-[#1F2937] text-[14px] font-medium">
                        {task.title}
                      </div>
                      <div className="text-[#6B7280] text-[13px]">
                        {task.fieldName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
                        task.status === "completed"
                          ? "bg-[#E8F5E9] text-[#4CAF50]"
                          : "bg-[#FEF3C7] text-[#F59E0B]"
                      }`}
                    >
                      {task.status.replace("_", " ").toUpperCase()}
                    </span>
                    <div className="text-[#9CA3AF] text-[13px] mt-1">
                      {formatRecentDate(task.completedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
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
                  <div className="font-semibold text-[#1F2937] text-[15px]">
                    Password
                  </div>
                  <div className="text-[#6B7280] text-[13px]">
                    Update your password
                  </div>
                </div>
              </div>
              <button className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all">
                Change Password
              </button>
            </div>

            {/* Notification Settings */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-[#F59E0B]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937] text-[15px]">
                    Notification Preferences
                  </div>
                  <div className="text-[#6B7280] text-[13px]">
                    Manage your notification settings
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/settings")}
                className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all"
              >
                Manage
              </button>
            </div>

            {/* Logout Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                  <LogOut size={20} className="text-[#EF4444]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1F2937] text-[15px]">
                    Logout
                  </div>
                  <div className="text-[#6B7280] text-[13px]">
                    Sign out of your account
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="h-10 px-5 bg-[#EF4444] text-white rounded-lg font-semibold hover:bg-[#DC2626] transition-all flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
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
            </div>
          </div>
        </div>
    </>
  );
}