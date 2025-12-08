// src/services/auth.service.ts

import api from '@/lib/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterAdminRequest,
  RegisterWorkerRequest,
  RegisterResponse,
} from '@/types/auth.types';

// Login (for all user types: admin, worker, platform_admin)
async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/api/auth/login', data);
  return response.data;
}

// Fetch current user profile from backend
async function fetchProfile(): Promise<any> {
  const response = await api.get('/api/auth/profile');
  return response.data.data;
}

// Register Admin (Farm Owner) - Creates farm and admin account
async function registerAdmin(
  data: RegisterAdminRequest
): Promise<RegisterResponse> {
  const res = await api.post('/api/auth/register', {
    role: 'admin',
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    farmName: data.farmName,
    location: data.farmLocation,
  });

  const d = res.data; // backend response

  return {
    success: true,
    message: 'Registration successful',
    data: {
      userId: d.userId || d.data?.userId,
      email: d.email || d.data?.email,
      name: d.name || d.data?.name,
      role: d.role || d.data?.role || 'admin',
      farmId: d.farmId || d.data?.farmId,
      farmName: (d.farmName || d.data?.farmName) ?? null,
      token: d.token || d.data?.token,
      refreshToken: (d.refreshToken || d.data?.refreshToken) ?? '',
      expiresIn: (d.expiresIn || d.data?.expiresIn) ?? 3600,
      joinCode: (d.joinCode || d.data?.joinCode) ?? null, 
    },
  };
}


// Register Worker - Joins existing farm using farm code
async function registerWorker(data: RegisterWorkerRequest): Promise<RegisterResponse> {
  // API v2.0 expects POST to /api/auth/register with role and "joinCode"
  const response = await api.post('/api/auth/register', {
    role: "worker",
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    joinCode: data.farmCode, // send as joinCode for worker!
  });
  return response.data;
}

// Logout (client-side only - clear localStorage)
function logout(): void {
  localStorage.removeItem('token');
  // await api.post('/api/auth/logout');
}

// Get current user from localStorage - DEPRECATED/REMOVED
function getCurrentUser() {
  return null; // We no longer read user from localStorage
}

// Get current token from localStorage
function getToken(): string | null {
  return localStorage.getItem('token');
}

// Save authentication data to localStorage
function saveAuthData(token: string, user: any): void {
  localStorage.setItem('token', token);
  // We NO LONGER save user details to localStorage for security
}

// Check if user is authenticated
function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}

// Export all functions as authService object
export const authService = {
  login,
  fetchProfile,
  registerAdmin,
  registerWorker,
  logout,
  getCurrentUser,
  getToken,
  saveAuthData,
  isAuthenticated,
};
