// src/store/authStore.ts

import { create } from 'zustand';
import { User } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    try {
      const userProfile = await authService.fetchProfile();

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        farmId: userProfile.farmId,
        farmName: userProfile.farm?.name,
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
