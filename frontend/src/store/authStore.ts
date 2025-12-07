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
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        // Verify token by fetching profile
        try {
          // We need to set the token in the store first so the interceptor might use it?
          // Actually, interceptor usually reads from localStorage or store.
          // Assuming api interceptor reads from localStorage 'token'.
          
          const userProfile = await authService.fetchProfile();
          
          // Map backend profile to User type if needed, or assume it matches
          // Backend returns: { id, name, email, role, farmId, ... }
          // User type expects: { id, email, name, role, farmId, farmName? }
          
          const user: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            farmId: userProfile.farmId,
            farmName: userProfile.farm?.name
          };

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          console.error('Failed to fetch profile with token:', err);
          // Token invalid or expired
          localStorage.removeItem('token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },

}));
