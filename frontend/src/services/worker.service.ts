// src/services/worker.service.ts
import  api  from '@/lib/api';

// === Types ===

export interface WorkerListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'worker' | 'admin' | 'platformadmin';
  status: 'active' | 'inactive';
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
  role: 'worker' | 'admin' | 'platformadmin';
  status: 'active' | 'inactive';
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

// === Services ===

// GET /workers/statistics
export async function getWorkerStatistics() {
  const res = await api.get<WorkerStats>('/workers/statistics');
  return res.data;
}

// GET /workers
export interface GetWorkersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
}

export async function getWorkers(params: GetWorkersParams = {}) {
  const res = await api.get<any>('/workers', { params });
  // The backend returns { success: true, data: { items: [], pagination: {} } }
  return res.data?.data || { items: [], pagination: {} };
}

// GET /workers/:id
export async function getWorkerById(id: number) {
  const res = await api.get<any>(`/workers/${id}`);
  return res.data?.data;
}

// PUT /workers/:id
export async function updateWorker(
  id: number,
  data: { name?: string; phone?: string },
) {
  const res = await api.put<{ message: string }>(`/workers/${id}`, data);
  return res.data;
}

// DELETE /workers/:id
export async function deleteWorker(id: number) {
  const res = await api.delete<{ message: string }>(`/workers/${id}`);
  return res.data;
}

// POST /workers/:id/assign-task
export async function assignTaskToWorker(workerId: number, taskId: number) {
  const res = await api.post<{ message: string }>(
    `/workers/${workerId}/assign-task`,
    { taskId },
  );
  return res.data;
}
