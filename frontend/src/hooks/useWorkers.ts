// src/hooks/useWorkers.ts
'use client';

import { useEffect, useState } from 'react';
import  api  from '@/lib/api';

export interface WorkerItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive';
  assignedTasks: number;
  completedTasks: number;
  performancePercent: number;
  avatarInitials: string;
}

export interface WorkerStats {
  totalWorkers: number;
  activeToday: number;
  tasksDoneThisWeek: number;
}

const DUMMY_WORKERS: WorkerItem[] = [
  {
    id: 1,
    name: 'Ahmed Khalil',
    email: 'ahmed@email.com',
    phone: '+213 555 123 456',
    role: 'worker',
    status: 'active',
    assignedTasks: 5,
    completedTasks: 42,
    performancePercent: 95,
    avatarInitials: 'AK',
  },
  {
    id: 2,
    name: 'Sara Mansouri',
    email: 'sara@email.com',
    phone: '+213 555 789 012',
    role: 'worker',
    status: 'active',
    assignedTasks: 3,
    completedTasks: 38,
    performancePercent: 92,
    avatarInitials: 'SM',
  },
];

const DUMMY_STATS: WorkerStats = {
  totalWorkers: 8,
  activeToday: 6,
  tasksDoneThisWeek: 25,
};

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerItem[]>([]);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // GET /workers/statistics
      const statsRes = await api
        .get('/workers/statistics')
        .catch(() => ({ data: DUMMY_STATS }));

      // GET /workers (paginated)
      const listRes = await api
        .get('/workers', { params: { page: 1, limit: 20 } })
        .catch(() => ({ data: { items: DUMMY_WORKERS } }));

      setStats(statsRes.data);

      const items: WorkerItem[] = listRes.data.items.map((w: any) => ({
        id: w.id,
        name: w.name,
        email: w.email,
        phone: w.phone,
        role: w.role,
        status: w.status as 'active' | 'inactive',
        assignedTasks: w.assignedTasks,
        completedTasks: w.completedTasks,
        performancePercent: w.performancePercent,
        avatarInitials: w.avatarInitials,
      }));

      setWorkers(items);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          'Failed to load workers',
      );
      // still show dummy data so UI is not empty
      setStats(DUMMY_STATS);
      setWorkers(DUMMY_WORKERS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    workers,
    stats,
    isLoading,
    error,
    reload: load,
  };
}
