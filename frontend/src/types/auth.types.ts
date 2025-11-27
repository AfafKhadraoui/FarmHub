// src/types/auth.types.ts

export type UserRole = 'admin' | 'worker' | 'platform_admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  farmId: number | null;
  farmName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    email: string;
    name: string;
    role: UserRole;
    farmId: number | null;
    farmName: string | null;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  farmName: string;
  farmLocation: string;
}

export interface RegisterWorkerRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  farmCode: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    email: string;
    name: string;
    role: UserRole;
    farmId: number | null;
    farmName?: string | null;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}
