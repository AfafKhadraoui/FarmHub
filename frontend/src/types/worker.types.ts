// src/types/worker.types.ts

export type WorkerStatus = 'active' | 'inactive';

export type WorkerRole = 'worker' | 'admin' | 'platformadmin';

export interface WorkerListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: WorkerRole;
  status: WorkerStatus;
  assignedTasks: number;
  completedTasks: number;
  performancePercent: number;
  avatarInitials: string;
}

export interface WorkerListResponse {
  items: WorkerListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface WorkerStats {
  totalWorkers: number;
  activeToday: number;
  tasksDoneThisWeek: number;
}

export interface WorkerDetails {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: WorkerRole;
  status: WorkerStatus;
  joinedAt: string;
  performancePercent: number;
  assignedTasksCount: number;
  completedTasksCount: number;
  recentTasks: {
    id: number;
    title: string;
    status: string;
    fieldName: string;
    completedAt: string;
  }[];
}
