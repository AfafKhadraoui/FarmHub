// Notification Types - Backend aligned with Prisma schema

export type NotificationType =
  | "task-assigned"
  | "task-overdue"
  | "task-completed"
  | "task-updated"
  | "field-update"
  | "weather-alert"
  | "system"
  | "harvest-schedule"
  | "equipment-alert"
  | "worker-report"
  | "schedule-update";

export interface Notification {
  id: string;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  // Optional metadata
  metadata?: {
    taskId?: number;
    fieldId?: number;
    workerId?: number;
    priority?: string;
    [key: string]: any;
  };
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}

export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}
