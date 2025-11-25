import api from "@/lib/api";

export const fieldService = {
  getAll: async () => {
    const response = await api.get("/api/fields");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/fields/${id}`);
    return response.data;
  },

  getHistory: async (id: number) => {
    const response = await api.get(`/api/fields/${id}/history`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/api/fields", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/api/fields/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/fields/${id}`);
    return response.data;
  },
};
