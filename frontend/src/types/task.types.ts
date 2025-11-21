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

export interface CreateTaskData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  fieldId?: number;
  workerIds: number[];
}
