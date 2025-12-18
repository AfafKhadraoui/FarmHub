import api from "@/lib/api";

export interface Field {
  id: number;
  name: string;
  size: number | string;
  cropType: string;
  status: "idle" | "planted" | "growing" | "harvesting" | "harvested";
  progress: number;
  plantedDate?: string | null;
  harvestDate?: string | null;
  activeTasks?: number;
  assignedWorkers?: number;
  tasks?: any[];
}

export const fieldService = {
  // Get all fields (for admin/farmer)
  getAll: async (page = 1, limit = 50) => {
    const response = await api.get(`/fields/paginated?page=${page}&limit=${limit}`);
    return response.data; // { data: [], meta: {} }
  },

  // Get assigned fields (for worker)
  getWorkerFields: async () => {
    const response = await api.get("/fields/worker/fields");
    return response.data; // []
  },

  // Create new field
  create: async (data: Omit<Field, "id" | "progress" | "activeTasks" | "assignedWorkers">) => {
    const response = await api.post("/fields", data);
    return response.data;
  },

  // Get field details
  getById: async (id: number) => {
    // We'll use query param for fieldId to match our planned backend fix
    const response = await api.get(`/fields/details?fieldId=${id}`);
    return response.data;
  },

  // Get worker field details
  getWorkerFieldDetails: async (id: number) => {
    const response = await api.get(`/fields/worker/fields/${id}`);
    return response.data;
  },

  // Get field history
  getHistory: async (id: number, filter = "all") => {
    const response = await api.get(`/fields/${id}/history?filter=${filter}`);
    return response.data;
  },

  // Update field
  update: async (id: number, data: any) => {
    const response = await api.put(`/fields/${id}`, data);
    return response.data;
  }
};
