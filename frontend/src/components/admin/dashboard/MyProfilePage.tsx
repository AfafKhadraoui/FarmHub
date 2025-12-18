import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProfileService } from '../../../services/admin.profile.service';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Phone,
  Camera,
  Upload,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: adminProfileService.getProfile,
  });

  // Edit form state
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    bio: '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name,
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
      setAvatarPreview(profile.avatarUrl);
    }
  }, [profile]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => adminProfileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      setIsEditing(false);
      alert('Profile updated successfully!');
    },
    onError: (error: any) => {
      alert('Failed to update profile: ' + (error.response?.data?.error || error.message));
    },
  });

  // Avatar upload mutation
  const avatarMutation = useMutation({
    mutationFn: (file: File) => adminProfileService.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      setAvatarPreview(data.avatarUrl);
      alert('Avatar uploaded successfully!');
    },
    onError: (error: any) => {
      alert('Failed to upload avatar: ' + (error.response?.data?.error || error.message));
    },
  });

  const handleSave = () => {
    updateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      avatarMutation.mutate(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">
          Failed to load profile. Please make sure you're logged in.
        </p>
        <button
          onClick={() => router.push('/admin/login')}
          className="mt-4 text-blue-600 underline"
        >
          Go to Login
        </button>
      </div>
    );
  }


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
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-[#4baf47] text-white rounded-lg hover:bg-[#3d9639] transition-colors disabled:opacity-50"
            >
              <Save size={18} strokeWidth={2} />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Gradient Banner */}
        <div className="relative bg-gradient-to-r from-[#4baf47] to-[#ff6b00] h-[120px]">
          {/* Avatar */}
          <div className="absolute bottom-[-60px] left-10">
            <div className="relative group">
              <div className="w-[120px] h-[120px] rounded-full bg-white border-4 border-white shadow-[0px_4px_16px_rgba(0,0,0,0.2)]">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={profile?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4baf47] to-[#ff6b00] flex items-center justify-center">
                    <User size={48} className="text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              
              {/* Upload Button Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarMutation.isPending}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
              >
                {avatarMutation.isPending ? (
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
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* User Info */}
          <div className="pt-20 pl-[60px] mb-6">
            <h2
              className="text-[28px] font-bold text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profile?.name}
            </h2>
            <p
              className="text-gray-600 mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profile?.role === 'platform_admin' ? 'Platform Administrator' : profile?.role}
            </p>
            <p
              className="text-gray-500 text-sm mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {profile?.email}
            </p>
          </div>


          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
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
                    {profile?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Mail size={18} className="text-gray-400" />
                <span
                  className="text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {profile?.email}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  placeholder="Optional"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4baf47] focus:border-transparent"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-gray-400" />
                  <span
                    className="text-gray-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {profile?.phone || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Role (read-only) */}
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
                  {profile?.role === 'platform_admin' ? 'Platform Administrator' : profile?.role}
                </span>
              </div>
            </div>

            {/* Member Since (read-only) */}
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
                  {new Date(profile?.createdAt || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Bio */}
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
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4baf47] focus:border-transparent resize-none"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <p
                  className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {profile?.bio || 'No bio provided yet.'}
                </p>
              )}
            </div>
          </div>
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
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
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