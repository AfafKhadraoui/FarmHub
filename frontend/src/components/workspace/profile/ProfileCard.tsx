// components/profile/ProfileCard.tsx
import React, { useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  Shield,
  MapPin,
  Camera,
} from "lucide-react";

interface ProfileCardProps {
  profile: any;
  isEditing: boolean;
  saving: boolean;
  formData: { name: string; phone: string };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (data: { name: string; phone: string }) => void;
  onAvatarUpload?: (file: File) => void;
  avatarPreview?: string | null;
}

export const ProfileCard = ({
  profile,
  isEditing,
  saving,
  formData,
  onEdit,
  onSave,
  onCancel,
  onFormChange,
  onAvatarUpload,
  avatarPreview,
}: ProfileCardProps) => {
  const isAdmin = profile.role?.toLowerCase() === "admin";
  const isWorker = profile.role?.toLowerCase() === "worker";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Convert relative avatar URL to absolute URL
  const getAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return null;
    if (avatar.startsWith("http")) return avatar;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${apiBase}${avatar}`;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setUploadingAvatar(true);
      try {
        await onAvatarUpload(file);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm mb-8">
      {/* Cover Section */}
      <div className="h-32 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] rounded-t-2xl relative">
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            {avatarPreview || getAvatarUrl(profile.avatar) ? (
              <img
                src={avatarPreview || getAvatarUrl(profile.avatar)!}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full border-4 border-white
                  bg-gradient-to-br from-[#4CAF50] to-[#81C784]
                  flex items-center justify-center"
              >
                <span className="text-white font-bold text-[40px]">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}

            {onAvatarUpload && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploadingAvatar ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : (
                    <Camera size={32} className="text-white" strokeWidth={2} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              className="font-bold text-[#1F2937] mb-2 text-[24px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {profile.name}
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
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
              {isWorker && profile.status && (
                <span
                  className={`px-3 py-1 rounded-full text-[13px] font-semibold ${
                    profile.status === "active"
                      ? "bg-[#E8F5E9] text-[#4CAF50]"
                      : "bg-[#FEE2E2] text-[#EF4444]"
                  }`}
                >
                  {profile.status.charAt(0).toUpperCase() +
                    profile.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="h-10 px-6 bg-white border border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all flex items-center gap-2"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                disabled={saving}
                className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={onSave}
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
                  onFormChange({ ...formData, name: e.target.value })
                }
                className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-[#1F2937] text-[15px]">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
              <Mail size={16} />
              Email Address
            </label>
            <p className="text-[#1F2937] text-[15px]">{profile.email}</p>
            <p className="text-[#9CA3AF] text-[12px] mt-1">
              Email cannot be changed
            </p>
          </div>

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
                  onFormChange({ ...formData, phone: e.target.value })
                }
                className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-[#1F2937] text-[15px]">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
              <Calendar size={16} />
              Member Since
            </label>
            <p className="text-[#1F2937] text-[15px]">
              {formatDate(
                profile.joinedDate || profile.joinedAt || profile.createdAt,
              )}
            </p>
          </div>

          {isWorker &&
            profile.assignedFarms &&
            profile.assignedFarms.length > 0 && (
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
                  <MapPin size={16} />
                  Assigned Farms
                </label>
                <div className="space-y-2">
                  {profile.assignedFarms.map((farm: any) => (
                    <div
                      key={farm.id}
                      className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
                    >
                      <p className="text-[#1F2937] font-medium">{farm.name}</p>
                      <p className="text-[#6B7280] text-sm">
                        Owner: {farm.owner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
