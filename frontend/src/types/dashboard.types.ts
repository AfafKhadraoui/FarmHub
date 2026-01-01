// Common Types
export interface Worker {
  id: string;
  name: string;
  initials?: string;
}

export interface Field {
  id: string;
  name: string;
  size?: number;
  cropType?: string;
  status?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  uvLevel: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  fieldId?: string;
  fieldName?: string;
  assignedWorkers?: Worker[];
  progressPercent?: number;
  completedAt?: string;
}

// Activity Types
export interface Activity {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}

// Field Status Types
export interface FieldStatus {
  id: string;
  name: string;
  size: number;
  cropType: string;
  status: string;
  activeTasks: number;
  workersCount: number;
  progressPercent: number;
}

// Dashboard Overview Response Types
export interface DashboardOverviewResponse {
  success: boolean;
  message?: string;
  data?: {
    fields: {
      total: number;
      monthlyIncrease: number;
      active: number;
    };
    tasks: {
      total: number;
      pending: number;
      in_progress: number;
      completed: number;
      doneToday: number;
      pendingIncreaseToday: number;
    };
    workers: {
      total: number;
      activeToday: number;
    };
    progress: {
      completionPercent: number;
      weeklyChangePercent: number;
    };
  };
}

export interface WorkerDashboardResponse {
  success: boolean;
  message?: string;
  data?: {
    taskStatistics: {
      pending: { count: number; label: string };
      inProgress: { count: number; label: string };
      completed: { count: number; label: string };
    };
    todayTasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueTime: string;
      fieldName: string | null;
    }>;
    upcomingTasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      dueDate: string;
      fieldName: string | null;
    }>;
    weather: {
      temperature: number;
      condition: string;
      humidity: number;
      windSpeed: number;
      icon: string;
    };
  };
}

export interface FarmActivityResponse {
  success: boolean;
  message?: string;
  data?: {
    activeTasks: Task[];
    fieldStatus: FieldStatus[];
  };
}

export interface RecentActivityResponse {
  success: boolean;
  message?: string;
  data?: {
    activities: Activity[];
  };
}

export interface RecentTasksResponse {
  success: boolean;
  message?: string;
  data?: {
    tasks: Task[];
  };
}

export interface TodayOverviewResponse {
  success: boolean;
  message?: string;
  data?: {
    weather: WeatherData;
    fields: {
      total: number;
      activeFields: number;
      totalArea: number;
      underCultivationArea: number;
    };
  };
}

// Query Parameter Types
export interface FarmActivityQueryParams {
  taskLimit?: number;
  fieldLimit?: number;
}

export interface RecentActivityQueryParams {
  limit?: number;
}

export interface RecentTasksQueryParams {
  limit?: number;
}