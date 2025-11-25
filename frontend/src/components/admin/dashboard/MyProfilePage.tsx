"use client";

import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dev Team",
    email: "dev@farmhub.com",
    role: "Platform Admin",
    joinDate: "January 2024",
    bio: "Managing FarmHub platform and ensuring smooth operations for all users.",
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
    setShowLogoutModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            My Profile
          </h1>
          <p
            className="text-gray-600 mt-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Manage your account information
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4baf47] text-white rounded-lg hover:bg-[#3d9639] transition-colors"
          >
            <Edit2 size={18} strokeWidth={2} />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Edit Profile
            </span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X size={18} strokeWidth={2} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#4baf47] text-white rounded-lg hover:bg-[#3d9639] transition-colors"
            >
              <Save size={18} strokeWidth={2} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Save Changes
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Gradient Banner */}
        <div className="relative bg-linear-to-r from-[#4baf47] to-[#ff6b00] h-[120px]">
          {/* Avatar - positioned absolute to overlap banner */}
          <div className="absolute bottom-[-60px] left-10 w-[120px] h-[120px] rounded-full bg-white border-4 border-white shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
            <div className="w-full h-full rounded-full bg-linear-to-br from-[#4baf47] to-[#ff6b00] flex items-center justify-center">
              <User size={48} className="text-white" strokeWidth={2.5} />
            </div>
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#4baf47] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3d9639] transition-colors shadow-lg"
              >
                <Edit2 size={18} className="text-white" strokeWidth={2} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Photo selected:", file.name);
                      // Handle photo upload
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* User Info - below gradient with proper spacing */}
          <div className="pt-20 pl-[60px] mb-6">
            <h2
              className="text-[28px] font-bold text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profileData.name}
            </h2>
            <p
              className="text-gray-600 mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profileData.role}
            </p>
            <p
              className="text-gray-500 text-sm mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profileData.email}
            </p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4baf47] focus:border-transparent"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <User size={18} className="text-gray-400" />
                  <span
                    className="text-gray-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {profileData.name}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4baf47] focus:border-transparent"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-gray-400" />
                  <span
                    className="text-gray-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {profileData.email}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Role
              </label>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Shield size={18} className="text-gray-400" />
                <span
                  className="text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {profileData.role}
                </span>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Member Since
              </label>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Calendar size={18} className="text-gray-400" />
                <span
                  className="text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {profileData.joinDate}
                </span>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4baf47] focus:border-transparent resize-none"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <p
                  className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {profileData.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Farms
            </span>
          </div>
          <p
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            45
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Users
            </span>
          </div>
          <p
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            1,234
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Active Tasks
            </span>
          </div>
          <p
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            89
          </p>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-lg font-semibold text-gray-900 mb-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Account Actions
            </h3>
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Sign out of your account
            </p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} strokeWidth={2} />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
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
              Are you sure you want to logout? You will need to sign in again to
              access your account.
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
        </div>
      )}
    </div>
  );
}
