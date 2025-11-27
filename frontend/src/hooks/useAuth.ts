// src/hooks/useAuth.ts

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import {
  LoginRequest,
  RegisterAdminRequest,
  RegisterWorkerRequest,
  User,
} from "@/types/auth.types";

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

  const mapLoginDataToUser = (data: {
    userId: number;
    email: string;
    name: string;
    role: User["role"];
    farmId: number | null;
    farmName: string | null;
  }): User => ({
    id: data.userId,
    email: data.email,
    name: data.name,
    role: data.role,
    farmId: data.farmId,
    farmName: data.farmName,
  });

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);

      const response = await authService.login(data); // expects { success, data, message }

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      const loginData = response.data;

      const loggedUser = mapLoginDataToUser({
        userId: loginData.userId,
        email: loginData.email,
        name: loginData.name,
        role: loginData.role,
        farmId: loginData.farmId,
        farmName: loginData.farmName,
      });

      const token = loginData.token;

      setUser(loggedUser);
      setToken(token);

      // IMPORTANT: this is what farms page will use
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // you can keep this cookie if other parts use it, but farms will use header
      document.cookie = `token=${token}; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`;

      if (loggedUser.role === "platform_admin") {
        await router.push("/admin/dashboard");
      } else {
        await router.push("/workspace/dashboard");
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Login failed",
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    data: RegisterAdminRequest | RegisterWorkerRequest
  ) => {
    try {
      setLoading(true);
      let response;

      if ("farmName" in data) {
        response = await authService.registerAdmin(data);
      } else {
        response = await authService.registerWorker(data);
      }

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      const regData = response.data;

      const newUser = mapLoginDataToUser({
        userId: regData.userId,
        email: regData.email,
        name: regData.name,
        role: regData.role,
        farmId: regData.farmId,
        farmName: regData.farmName ?? null,
      });

      const token = regData.token;

      setUser(newUser);
      setToken(token);

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      document.cookie = `token=${token}; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`;

      await router.push("/workspace/dashboard");
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
        code: error.response?.data?.code,
        details: error.response?.data?.details,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      authService.logout();
    } finally {
      storeLogout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      document.cookie = "token=; Path=/; Max-Age=0";
      await router.push("/login");
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
