import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from './useDashboard';
import { DashboardOverviewResponse, WorkerDashboardResponse } from '@/types/dashboard.types';

export const useDashboardStats = () => {
  const { fetchAdminOverview, fetchWorkerOverview, isAdmin, isWorker, loading, error, alert, closeAlert } = useDashboard();
  const [stats, setStats] = useState<DashboardOverviewResponse['data'] | WorkerDashboardResponse['data'] | null>(null);

  const loadDashboardStats = useCallback(async () => {
    try {
      if (isAdmin) {
        const result = await fetchAdminOverview();
        setStats(result.data);
      } else if (isWorker) {
        const result = await fetchWorkerOverview();
        setStats(result.data);
      }
    } catch (error) {
      // Error is already handled by useDashboard
      console.error('Failed to load dashboard stats:', error);
    }
  }, [isAdmin, isWorker, fetchAdminOverview, fetchWorkerOverview]);

  useEffect(() => {
    if (isAdmin || isWorker) {
      loadDashboardStats();
    }
  }, [isAdmin, isWorker, loadDashboardStats]);

  return {
    stats,
    loading,
    error,
    alert,
    closeAlert,
    refreshStats: loadDashboardStats,
    isAdmin,
    isWorker
  };
};