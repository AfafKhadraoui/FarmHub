import api from "@/lib/api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  register: async (data: any) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  logout: async () => {
    // TODO: Implement logout
  },
};
