import api from '@/lib/api';

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AdminProfileUpdateData {
  name?: string;
  phone?: string;
  bio?: string;
}

export const adminProfileService = {
  // Get admin profile
  getProfile: async (): Promise<AdminProfile> => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Update admin profile
  updateProfile: async (data: AdminProfileUpdateData): Promise<AdminProfile> => {
    const response = await api.patch('/admin/profile', data);
    return response.data;
  },

  // Upload avatar (optional - if you implement it later)
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/admin/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};