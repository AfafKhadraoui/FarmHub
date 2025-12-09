// src/hooks/useTasks.ts
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { TaskStatus, TaskPriority } from '@/types/task.types';

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
  const [adminFilters, setAdminFiltersState] = useState<{ status?: string; page?: number }>({});
  const [workerFilters, setWorkerFiltersState] = useState<{ status?: string; page?: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // dummy data matching the design
    const now = new Date();
    const today17 = new Date(now);
    today17.setHours(17, 0, 0, 0);

    const adminDummy: AdminTask[] = [
      {
        id: 501,
        title: 'Water irrigation system - Field A',
        description: 'Check irrigation lines and run for 2 hours',
        status: 'inprogress',
        priority: 'high',
        dueDate: today17.toISOString(),
        fieldId: 1,
        fieldName: 'Field A',
        assignedWorkers: [
          { id: 3, name: 'Ahmed Khalil', initials: 'AK' },
          { id: 5, name: 'Sara Mansouri', initials: 'SM' },
        ],
        progressPercent: 60,
      },
      {
        id: 510,
        title: 'Apply fertilizer - Field B',
        description: 'Apply organic fertilizer',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
        fieldId: 2,
        fieldName: 'Field B',
        assignedWorkers: [{ id: 4, name: 'Ali Belkacem', initials: 'AB' }],
        progressPercent: 0,
      },
      {
        id: 515,
        title: 'Harvest wheat - Field C',
        description: 'Complete harvest of wheat crop',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        fieldId: 3,
        fieldName: 'Field C',
        assignedWorkers: [
          { id: 3, name: 'Ahmed Khalil', initials: 'AK' },
        ],
        progressPercent: 100,
      },
    ];

    const workerDummy: WorkerTask[] = [
      {
        id: 'task_123',
        title: 'Water irrigation system - Field A',
        description: 'Check and maintain irrigation system',
        status: 'INPROGRESS',
        priority: 'HIGH',
        dueDate: today17.toISOString(),
        field: { id: 'field_001', name: 'Field A' },
        progress: 60,
      },
      {
        id: 'task_124',
        title: 'Check soil moisture - Field A',
        description: 'Measure moisture and record values',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: today17.toISOString(),
        field: { id: 'field_001', name: 'Field A' },
        progress: 0,
      },
      {
        id: 'task_125',
        title: 'Prune trees - Orchard',
        description: 'Prune all fruit trees in orchard',
        status: 'COMPLETED',
        priority: 'LOW',
        dueDate: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        field: { id: 'field_002', name: 'Orchard' },
        progress: 100,
      },
    ];

    setIsLoading(false);
    if (user.role === 'admin') {
      setAllAdminTasks(adminDummy);
    } else {
      setAllWorkerTasks(workerDummy);
    }
  }, [user]);

  // Filter tasks based on status
  const getFilteredAdminTasks = () => {
    if (!adminFilters.status || adminFilters.status === 'ALL' || adminFilters.status === 'all') {
      return allAdminTasks;
    }
    const statusLower = adminFilters.status.toLowerCase();
    return allAdminTasks.filter(task => {
      const taskStatus = task.status.toLowerCase();
      if (statusLower === 'pending' || statusLower === 'PENDING') return taskStatus === 'pending';
      if (statusLower === 'inprogress' || statusLower === 'INPROGRESS' || statusLower === 'in_progress') return taskStatus === 'inprogress';
      if (statusLower === 'completed' || statusLower === 'COMPLETED') return taskStatus === 'completed';
      return true;
    });
  };

  const getFilteredWorkerTasks = () => {
    if (!workerFilters.status || workerFilters.status === 'ALL' || workerFilters.status === 'all') {
      return allWorkerTasks;
    }
    const statusUpper = workerFilters.status.toUpperCase();
    return allWorkerTasks.filter(task => {
      if (statusUpper === 'PENDING') return task.status === 'PENDING';
      if (statusUpper === 'INPROGRESS' || statusUpper === 'IN_PROGRESS') return task.status === 'INPROGRESS';
      if (statusUpper === 'COMPLETED') return task.status === 'COMPLETED';
      return true;
    });
  };

  const adminTasks = getFilteredAdminTasks();
  const workerTasks = getFilteredWorkerTasks();

  // Calculate stats based on user role
  const stats = user?.role === 'admin'
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
