import api from "@/lib/api";

export const taskService = {
  getAll: async () => {
    const response = await api.get("/api/tasks");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/api/tasks", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
};
