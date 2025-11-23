import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when ready
      // const data = await adminService.getProfile();

      // MOCK DATA - Remove when backend is ready
      const mockProfile: AdminProfile = {
        id: 1,
        name: "Dev Team",
        email: "dev@farmhub.com",
        role: "Platform Admin",
        phone: "+1234567890",
        bio: "Managing FarmHub platform and ensuring smooth operations for all users.",
        createdAt: "2024-01-01T00:00:00Z",
      };

      setProfile(mockProfile);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<AdminProfile>) => {
    try {
      // TODO: Replace with actual API call
      // const updated = await adminService.updateProfile(updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      // TODO: Replace with actual API call
      // const result = await adminService.uploadAvatar(file);
      // setProfile(prev => prev ? { ...prev, avatarUrl: result.avatarUrl } : null);
      console.log("Avatar upload:", file.name);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
}
