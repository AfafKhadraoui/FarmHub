import api from "@/lib/api";
import {
  FarmerProfile,
  WorkerProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile.types";

export type ProfileResponse = FarmerProfile | WorkerProfile;

export async function fetchProfile(): Promise<ProfileResponse> {
  // backend exposes profile at /api/profile (settingsRoutes mounted on /api)
  const res = await api.get("/api/profile");
  return res.data;
}

export async function updateProfile(data: UpdateProfileRequest) {
  // update endpoint is /api/profile (PATCH/PUT supported)
  const res = await api.patch("/api/profile", data);
  return res.data;
}

export async function changePassword(payload: ChangePasswordRequest) {
  const res = await api.put("/api/settings/change-password", payload);
  return res.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post("/api/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export const profileService = {
  fetchProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
};
