import api from "@/lib/api";

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  },
};
