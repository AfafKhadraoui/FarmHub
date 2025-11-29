// Field Service - API calls for field management

import api from "@/lib/api";
import {
  Field,
  FieldWithRelations,
  CreateFieldData,
  UpdateFieldData,
  FieldFilters,
  FieldStats,
  FieldHistory,
} from "@/types/field.types";

export const fieldService = {
  // Get all active fields for the authenticated user's farm
  getAll: async (filters?: FieldFilters): Promise<Field[]> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.cropType) params.append("cropType", filters.cropType);
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(`/api/fields?${params.toString()}`);
    return response.data;
  },

  // Get a single field by ID with relations (tasks, workers)
  getById: async (id: number): Promise<FieldWithRelations> => {
    const response = await api.get(`/api/fields/${id}`);
    return response.data;
  },

  // Get field history (archived records)
  getHistory: async (id: number): Promise<FieldHistory[]> => {
    const response = await api.get(`/api/fields/${id}/history`);
    return response.data;
  },

  // Create a new field
  create: async (data: CreateFieldData): Promise<Field> => {
    const response = await api.post("/api/fields", data);
    return response.data;
  },

  // Update an existing field
  update: async (id: number, data: UpdateFieldData): Promise<Field> => {
    const response = await api.patch(`/api/fields/${id}`, data);
    return response.data;
  },

  // Archive a field (sets active=false, creates history record)
  archive: async (id: number): Promise<void> => {
    const response = await api.patch(`/api/fields/${id}/archive`);
    return response.data;
  },

  // Restore an archived field
  restore: async (id: number): Promise<Field> => {
    const response = await api.patch(`/api/fields/${id}/restore`);
    return response.data;
  },

  // Delete a field (hard delete - use archive instead)
  delete: async (id: number): Promise<void> => {
    const response = await api.delete(`/api/fields/${id}`);
    return response.data;
  },

  // Get field statistics
  getStats: async (): Promise<FieldStats> => {
    const response = await api.get("/api/fields/stats");
    return response.data;
  },

  // Get archived fields
  getArchived: async (): Promise<Field[]> => {
    const response = await api.get("/api/fields/archived");
    return response.data;
  },
};
