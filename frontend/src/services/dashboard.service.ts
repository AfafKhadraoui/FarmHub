import api from '@/lib/api';
import {
  DashboardOverviewResponse,
  WorkerDashboardResponse,
  FarmActivityResponse,
  RecentActivityResponse,
  RecentTasksResponse,
  TodayOverviewResponse,
  FarmActivityQueryParams,
  RecentActivityQueryParams,
  RecentTasksQueryParams
} from '@/types/dashboard.types';

export const dashboardService = {
  // Admin Dashboard Overview
  async getOverview(): Promise<DashboardOverviewResponse> {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  // Worker Dashboard Overview
  async getWorkerOverview(): Promise<WorkerDashboardResponse> {
    const response = await api.get('/dashboard/overview-worker');
    return response.data;
  },

  // Farm Activity
  async getFarmActivity(params?: FarmActivityQueryParams): Promise<FarmActivityResponse> {
    const response = await api.get('/dashboard/farm-activity', { params });
    return response.data;
  },

  // Recent Activity
  async getRecentActivity(params?: RecentActivityQueryParams): Promise<RecentActivityResponse> {
    const response = await api.get('/dashboard/recent-activity', { params });
    return response.data;
  },

  // Recent Tasks
  async getRecentTasks(params?: RecentTasksQueryParams): Promise<RecentTasksResponse> {
    const response = await api.get('/dashboard/recent-tasks', { params });
    return response.data;
  },

  // Today's Overview (Weather & Fields)
  async getTodayOverview(): Promise<TodayOverviewResponse> {
    const response = await api.get('/dashboard/today-overview');
    return response.data;
  }
};