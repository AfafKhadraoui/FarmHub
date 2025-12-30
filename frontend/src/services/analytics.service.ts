import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Try multiple possible token storage locations
    const token = 
      localStorage.getItem('token') || 
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed. Token might be invalid or expired.');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AnalyticsData {
  userGrowth: Array<{ month: string; users: number }>;
  taskVolume: Array<{ month: string; tasks: number }>;
  activeFarms: Array<{ farm: string; tasks: number }>;
  userDistribution: Array<{ name: string; value: number }>;
  topLocations: Array<{ location: string; farms: number }>;
}

export interface MetricsData {
  totalFarms: number;
  totalUsers: number;
  totalTasks: number;
  totalFields: number;
  farmsToday: number;
  usersToday: number;
  tasksToday: number;
  fieldsToday: number;
}

export interface FarmGrowthData {
  month: string;
  farms: number;
}

export const analyticsService = {
  // Get comprehensive analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  // Get basic metrics
  getMetrics: async (): Promise<MetricsData> => {
    const response = await api.get('/admin/metrics');
    return response.data;
  },

  // Get farm growth data
  getFarmGrowth: async (months: number = 6): Promise<FarmGrowthData[]> => {
    const response = await api.get('/admin/analytics/farm-growth', {
      params: { months },
    });
    return response.data;
  },
};