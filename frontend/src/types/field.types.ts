// Field Types - Backend aligned with Prisma schema

export type FieldStatus = "idle" | "planted" | "growing" | "harvesting";

export interface Field {
  id: number;
  name: string;
  size: number; // in hectares
  cropType: string | null;
  status: FieldStatus;
  plantedDate: string | null; // ISO date string
  harvestDate: string | null; // ISO date string
  active: boolean;
  farmId: number;
  createdAt: string;
  updatedAt: string;
  // Computed fields from backend
  progress?: number; // 0-100
  activeTasks?: number;
  assignedWorkers?: number;
}

export interface FieldWithRelations extends Field {
  farm: {
    id: number;
    name: string;
  };
  tasks: {
    id: number;
    title: string;
    status: string;
  }[];
}

export interface CreateFieldData {
  name: string;
  size: number;
  cropType: string | null;
  plantedDate: string | null;
  harvestDate: string | null;
  location?: string; // Optional metadata
  description?: string; // Optional metadata
}

export interface UpdateFieldData {
  name?: string;
  size?: number;
  status?: FieldStatus;
  plantedDate?: string | null;
  harvestDate?: string | null;
}

export interface FieldFilters {
  status?: FieldStatus;
  cropType?: string;
  search?: string;
}

export interface FieldStats {
  total: number;
  idle: number;
  planted: number;
  growing: number;
  harvesting: number;
}

export interface FieldHistory {
  id: number;
  fieldName: string;
  action: string;
  description: string;
  timestamp: string;
  userId: number;
  userName: string;
}
