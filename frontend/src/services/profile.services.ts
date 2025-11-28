import api from '@/lib/api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'worker' | 'platform_admin';
  farm: {
    id: number;
    name: string;
    location: string;
  } | null;
  createdAt: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
}

export const profileService = {
  // Get profile - matches backend GET /profile
  getProfile: async (): Promise<User> => {
  const response = await api.get('/profile');
  return response.data.data; // access the 'data' field returned by backend
},

  // Update profile - matches backend PATCH /profile
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
  const response = await api.patch('/profile', data);
  return response.data.data; // same here
},
};