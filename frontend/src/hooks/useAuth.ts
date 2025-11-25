// src/hooks/useAuth.ts

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterAdminRequest, RegisterWorkerRequest } from '@/types/auth.types';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    setLoading,
    logout: storeLogout,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      setUser(response.user);
      setToken(response.token);
      // Optionally also persist to storage if you want
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/workspace/dashboard');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error || // use "error" per backend
          error.response?.data?.message || // fallback if still using old format
          'Login failed',
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      };
    } finally {
      setLoading(false);
    }
  };

  // Register should dispatch either admin or worker,
  // call with correct props in your form's handleSubmit:
  //   - { name, email, password, ...farmName, farmLocation } for admin
  //   - { name, email, password, ...farmCode } for worker
  const register = async (
    data: RegisterAdminRequest | RegisterWorkerRequest
  ) => {
    try {
      setLoading(true);
      let response;
      // Detect type for correct endpoint
      if ('farmName' in data) {
        response = await authService.registerAdmin(data);
      } else {
        response = await authService.registerWorker(data);
      }
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/workspace/dashboard');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error || // display backend validation, see docs!
          error.response?.data?.message ||
          'Registration failed',
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
}
