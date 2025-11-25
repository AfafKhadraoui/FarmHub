import api from "@/lib/api";

export const workerService = {
  getAll: async () => {
    const response = await api.get("/api/workers");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/workers/${id}`);
    return response.data;
  },
};
