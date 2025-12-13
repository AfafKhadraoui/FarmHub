// src/types/task.types.ts

export type TaskStatus = 'pending' | 'inprogress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface AssignedWorker {
  id: number;
  name: string;
  initials: string;
}

export interface TaskListItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  fieldId: number | null;
  fieldName?: string | null;
  assignedWorkers: AssignedWorker[];
  progressPercent?: number;
}

export interface TaskListResponse {
  items: TaskListItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/** `/tasks/statistics` from FarmHub docs */
export interface TaskStatistics {
  pending: { count: number; increaseToday: number };
  inprogress: { count: number; dueToday: number };
  completed: { count: number };
}
