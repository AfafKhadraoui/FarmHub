// src/hooks/useTasks.ts
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { TaskStatus, TaskPriority } from '@/types/task.types';
import api from '@/lib/api';

type AdminTask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  fieldId: number | null;
  fieldName?: string | null;
  assignedWorkers: { id: number; name: string; initials: string }[];
  progressPercent: number;
};

type WorkerTask = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'PENDING' | 'INPROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  field?: { id: string; name: string };
  progress: number;
};

export function useTasks() {
  const { user } = useAuth();
  const [allAdminTasks, setAllAdminTasks] = useState<AdminTask[]>([]);
  const [allWorkerTasks, setAllWorkerTasks] = useState<WorkerTask[]>([]);
  const [adminFilters, setAdminFiltersState] = useState<{ status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }>({});
  const [workerFilters, setWorkerFiltersState] = useState<{ status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statsFromApi, setStatsFromApi] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();

    const fetchStatsAndTasks = async () => {
      setIsLoading(true);
      try {
        // --- 1) Statistics: backend response is wrapped as { success, data }
        const statsRes = await api.get('/tasks/statistics', { signal: controller.signal });
        const statsPayload = statsRes.data?.data ?? statsRes.data;
        setStatsFromApi(statsPayload);

        // --- 2) Tasks list – match backend pagination contract
        // Controller maps: pageSize <- query.limit | query.pageSize
        // Service returns: { data: tasks[], meta: {...} }
        const buildStatusParam = (statusValue?: string) => {
          if (!statusValue) return undefined;
          const normalized = statusValue.toLowerCase().trim();
          if (normalized === 'pending' || normalized === 'all') return 'pending';
          if (normalized === 'inprogress' || normalized === 'in_progress') return 'in_progress';
          if (normalized === 'completed' || normalized === 'done') return 'completed';
          return undefined;
        };

        if (user.role === 'admin') {
          const params: any = {
            page: adminFilters.page ?? 1,
            limit: adminFilters.limit ?? 10,
            status: buildStatusParam(adminFilters.status),
            // backend accepts orderBy/sortBy & order/sortOrder – we use orderBy/order
            orderBy: adminFilters.sortBy ?? undefined,
            order: adminFilters.sortOrder ?? undefined,
          };

          const tasksRes = await api.get('/tasks', { params, signal: controller.signal });
          const wrapper = tasksRes.data?.data ?? tasksRes.data;
          const tasksData = wrapper?.data ?? wrapper ?? [];
          setAllAdminTasks(tasksData);
        } else {
          const params: any = {
            page: workerFilters.page ?? 1,
            limit: workerFilters.limit ?? 10,
            status: buildStatusParam(workerFilters.status),
            orderBy: workerFilters.sortBy ?? undefined,
            order: workerFilters.sortOrder ?? undefined,
          };

          const tasksRes = await api.get('/tasks', { params, signal: controller.signal });
          const wrapper = tasksRes.data?.data ?? tasksRes.data;
          const tasksData = wrapper?.data ?? wrapper ?? [];
          setAllWorkerTasks(tasksData);
        }
      } catch (err: any) {
        // Ignore abort errors (component unmounted or filters changed)
        if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED' || err?.message?.includes('canceled')) {
          return;
        }
        console.error('Failed to load tasks or stats', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatsAndTasks();

    return () => controller.abort();
  }, [user, adminFilters, workerFilters]);

  // Filter tasks based on status (client side fallback, but backend should handle most filtering)
  const getFilteredAdminTasks = () => {
    // Backend already filters by status, so we mainly return what backend sent
    // But we do a client-side check as a safety net
    if (!adminFilters.status || adminFilters.status === 'ALL' || adminFilters.status === 'all' || adminFilters.status === '') {
      return allAdminTasks;
    }
    const statusLower = adminFilters.status.toLowerCase().trim();
    return allAdminTasks.filter(task => {
      const taskStatus = task.status.toLowerCase().trim();
      if (statusLower === 'pending') return taskStatus === 'pending';
      if (statusLower === 'inprogress' || statusLower === 'in_progress') return taskStatus === 'inprogress' || taskStatus === 'in_progress';
      if (statusLower === 'completed') return taskStatus === 'completed';
      return true;
    });
  };

  const getFilteredWorkerTasks = () => {
    if (!workerFilters.status || workerFilters.status === 'ALL' || workerFilters.status === 'all' || workerFilters.status === '') {
      return allWorkerTasks;
    }
    const statusUpper = workerFilters.status.toUpperCase().trim();
    return allWorkerTasks.filter(task => {
      const taskStatus = task.status.toUpperCase().trim();
      if (statusUpper === 'PENDING') return taskStatus === 'PENDING';
      if (statusUpper === 'INPROGRESS' || statusUpper === 'IN_PROGRESS') return taskStatus === 'INPROGRESS' || taskStatus === 'IN_PROGRESS';
      if (statusUpper === 'COMPLETED') return taskStatus === 'COMPLETED';
      return true;
    });
  };

  const adminTasks = getFilteredAdminTasks();
  const workerTasks = getFilteredWorkerTasks();

  // Prefer backend-provided stats when available, fall back to client-calculated
  let stats;
  if (statsFromApi) {
    // Backend statistics: see backend/src/services/taskService.js:getTaskStatistics
    // {
    //   totalTasks,
    //   completedTasks,
    //   inProgressTasks,
    //   pendingTasks,
    //   dueTodayTasks,
    //   newTasksToday,
    //   in_progressToday,
    //   comleted_today
    // }
    stats = {
      pending: {
        count: statsFromApi.pendingTasks ?? 0,
        increaseToday: statsFromApi.newTasksToday ?? 0,
      },
      inprogress: {
        count: statsFromApi.inProgressTasks ?? 0,
        dueToday: statsFromApi.dueTodayTasks ?? 0,
      },
      completed: {
        count: statsFromApi.completedTasks ?? 0,
        today: statsFromApi.comleted_today ?? 0,
      },
    };
  } else {
    stats = user?.role === 'admin'
      ? {
          pending: { count: allAdminTasks.filter(t => t.status === 'pending').length, increaseToday: 1 },
          inprogress: { count: allAdminTasks.filter(t => t.status === 'inprogress').length, dueToday: 1 },
          completed: { count: allAdminTasks.filter(t => t.status === 'completed').length },
        }
      : {
          pending: { count: allWorkerTasks.filter(t => t.status === 'PENDING').length, increaseToday: 1 },
          inprogress: { count: allWorkerTasks.filter(t => t.status === 'INPROGRESS').length, dueToday: 1 },
          completed: { count: allWorkerTasks.filter(t => t.status === 'COMPLETED').length },
        };
  }

  return {
    stats,
    adminTasks,
    workerTasks,
    isLoading,
    error: null as string | null,
    adminFilters,
    setAdminFilters: setAdminFiltersState,
    workerFilters,
    setWorkerFilters: setWorkerFiltersState,
    reload: () => {
      // Could refresh data here if needed
      window.location.reload();
    },
  };
}
