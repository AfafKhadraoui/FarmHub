import { useState, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { useAuth } from './useAuth';
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

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ isOpen: false, type: 'success', message: '' });

  // Show alert
  const showAlert = useCallback((type: 'success' | 'error', message: string) => {
    setAlert({ isOpen: true, type, message });
  }, []);

  // Close alert
  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Admin Dashboard Overview
  const fetchAdminOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getOverview();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard overview');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard overview';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Worker Dashboard Overview
  const fetchWorkerOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getWorkerOverview();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch worker dashboard');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch worker dashboard';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Farm Activity
  const fetchFarmActivity = useCallback(async (params?: FarmActivityQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getFarmActivity(params);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch farm activity');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch farm activity';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Recent Activity
  const fetchRecentActivity = useCallback(async (params?: RecentActivityQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getRecentActivity(params);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recent activity');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch recent activity';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Recent Tasks
  const fetchRecentTasks = useCallback(async (params?: RecentTasksQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getRecentTasks(params);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch recent tasks');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch recent tasks';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Today's Overview (Weather & Fields)
  const fetchTodayOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getTodayOverview();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch today\'s overview');
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch today\'s overview';
      setError(errorMessage);
      showAlert('error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // Get appropriate dashboard based on user role
  const fetchDashboardData = useCallback(async (options?: {
    includeTodayOverview?: boolean;
    includeRecentActivity?: boolean;
    includeFarmActivity?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const promises = [];
      
      // Fetch appropriate overview based on user role
      if (user?.role === 'admin') {
        promises.push(fetchAdminOverview());
      } else if (user?.role === 'worker') {
        promises.push(fetchWorkerOverview());
      }

      // Add optional data fetches
      if (options?.includeTodayOverview) {
        promises.push(fetchTodayOverview());
      }
      
      if (options?.includeRecentActivity) {
        promises.push(fetchRecentActivity({ limit: 10 }));
      }
      
      if (options?.includeFarmActivity) {
        promises.push(fetchFarmActivity({ taskLimit: 5, fieldLimit: 4 }));
      }

      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      // Error is already handled in individual functions
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchAdminOverview, fetchWorkerOverview, fetchTodayOverview, fetchRecentActivity, fetchFarmActivity]);

  return {
    // Data fetching functions
    fetchAdminOverview,
    fetchWorkerOverview,
    fetchFarmActivity,
    fetchRecentActivity,
    fetchRecentTasks,
    fetchTodayOverview,
    fetchDashboardData,
    
    // State
    loading,
    error,
    alert,
    closeAlert,
    
    // Helper to determine which dashboard to show
    isAdmin: user?.role === 'admin',
    isWorker: user?.role === 'worker'
  };
};