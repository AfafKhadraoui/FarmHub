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

// Register Admin (Farm Owner) - Creates farm and admin account
async function registerAdmin(data: RegisterAdminRequest): Promise<RegisterResponse> {
  // API v2.0 expects POST to /api/auth/register with role and correct fields
  const response = await api.post('/api/auth/register', {
    role: "admin",
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    farmName: data.farmName,
    location: data.farmLocation, // matches backend "location"
  });
  return response.data;
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
  localStorage.removeItem('user');
  // Optional: Call backend logout endpoint if you implement one
  // await api.post('/api/auth/logout');
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Get current token from localStorage
function getToken(): string | null {
  return localStorage.getItem('token');
}

// Save authentication data to localStorage
function saveAuthData(token: string, user: any): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Check if user is authenticated
function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

// Export all functions as authService object
export const authService = {
  login,
  registerAdmin,
  registerWorker,
  logout,
  getCurrentUser,
  getToken,
  saveAuthData,
  isAuthenticated,
};
