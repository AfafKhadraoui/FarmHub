// src/types/auth.types.ts

export type UserRole = 'admin' | 'worker' | 'platform_admin';

// User interface with farm details
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  farmId?: number;
  createdAt: string;
  updatedAt: string;
  farm?: {
    id: number;
    name: string;
    location: string;
    joinCode: string;
    createdAt: string;
  };
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login Response
export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

// Register Admin Request
export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  farmName: string;
  farmLocation: string;
}

// Register Worker Request
export interface RegisterWorkerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  farmCode: string;
}

// Register Response (same for both admin and worker)
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

// Auth Error
export interface AuthError {
  success: false;
  error: string;
  code: string;
  details?: any;
}