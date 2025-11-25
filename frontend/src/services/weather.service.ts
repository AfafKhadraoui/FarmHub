import api from "@/lib/api";

export const weatherService = {
  getCurrent: async (location: string) => {
    const response = await api.get(`/api/weather?location=${location}`);
    return response.data;
  },

  getForecast: async (location: string) => {
    const response = await api.get(
      `/api/weather/forecast?location=${location}`
    );
    return response.data;
  },
};
