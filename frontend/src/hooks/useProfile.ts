"use client";

import { useEffect, useState, useCallback } from "react";
import { profileService } from "@/services/profile.service";
import { Profile, UpdateProfileRequest, ChangePasswordRequest } from "@/types/profile.types";

export function useProfile() {
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

	return { profile, isLoading, error, refresh, update, changePassword };
}
