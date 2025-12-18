// src/services/task.service.ts
import api from '@/lib/api';
import {
  TaskStatistics,
  TaskListResponse,
} from '@/types/task.types';

/** Shared stats (backend scopes by role). */
export async function fetchTaskStatistics() {
  const res = await api.get<TaskStatistics>('/tasks/statistics');
  return res.data;
}

/** Admin list – farm‑wide tasks (FarmHub docs). */
export interface AdminTasksParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'inprogress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  fieldId?: number;
  search?: string;
  orderBy?: 'dueDate' | 'createdAt' | 'priority';
  order?: 'asc' | 'desc';
}

export async function fetchAdminTasks(params: AdminTasksParams = {}) {
  const res = await api.get<TaskListResponse>('/tasks', { params });
  return res.data;
}

/** Worker list – assigned tasks (worker_api_docs `/tasks`). */
export interface WorkerTasksParams {
  status?:
    | 'ALL'
    | 'TODO'
    | 'PENDING'
    | 'INPROGRESS'
    | 'COMPLETED'
    | 'OVERDUE';
  page?: number;
  limit?: number;
  sortBy?: 'dueDate' | 'priority' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  fieldId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchWorkerTasks(params: WorkerTasksParams = {}) {
  const res = await api.get('/tasks', { params });
  return res.data as {
    tasks: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

/** Create task (only admin/farmer) */
export async function createTask(data: any) {
  const res = await api.post('/tasks', data);
  return res.data;
}

/** Delete task (only admin/farmer) */
export async function deleteTask(id: number) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}
