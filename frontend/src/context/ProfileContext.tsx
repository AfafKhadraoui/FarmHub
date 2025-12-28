"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { profileService } from "@/services/profile.service";
import { Profile, UpdateProfileRequest, ChangePasswordRequest } from "@/types/profile.types";

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (payload: UpdateProfileRequest) => Promise<{ success: boolean; data?: any; error?: string }>;
  changePassword: (payload: ChangePasswordRequest) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.fetchProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => await load();

  const update = async (payload: UpdateProfileRequest) => {
    try {
      const res = await profileService.updateProfile(payload);
      // Immediately update local state with the new data
      setProfile(prev => prev ? { ...prev, ...payload } : null);
      // Then fetch fresh data from server
      await load();
      return { success: true, data: res };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const changePassword = async (payload: ChangePasswordRequest) => {
    try {
      const res = await profileService.changePassword(payload);
      return { success: true, data: res };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, refresh, update, changePassword }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}