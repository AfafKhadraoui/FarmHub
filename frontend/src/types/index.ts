// Type definitions
export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "worker" | "platform_admin";
  farmId?: number;
}

export interface Field {
  id: number;
  name: string;
  size: number;
  cropType: string;
  status: "idle" | "planted" | "growing" | "harvesting";
  plantedDate?: string;
  harvestDate?: string;
  active: boolean;
  farmId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  notes?: string;
  farmId: number;
  fieldId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignment {
  id: number;
  taskId: number;
  workerId: number;
  assignedAt: string;
}

export interface Farm {
  id: number;
  name: string;
  location: string;
  joinCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Weather types for API responses (not stored in database)
export interface Weather {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Forecast {
  date: string;
  temperature: number;
  condition: string;
}
