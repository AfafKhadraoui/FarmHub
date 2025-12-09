// src/components/workspace/workers/WorkerList.tsx
'use client';

import { WorkerCard } from './WorkerCard';

interface WorkerListProps {
  workers?: any[];
}

const DUMMY_WORKERS = [
  {
    id: 1,
    name: 'Ahmed Khalil',
    email: 'ahmed@email.com',
    phone: '+213 555 123 456',
    avatarInitials: 'AK',
    assignedTasks: 5,
    completedTasks: 42,
    performancePercent: 95,
    status: 'active' as const,
  },
  {
    id: 2,
    name: 'Sara Mansouri',
    email: 'sara@email.com',
    phone: '+213 555 789 012',
    avatarInitials: 'SM',
    assignedTasks: 3,
    completedTasks: 38,
    performancePercent: 92,
    status: 'active' as const,
  },
];

export function WorkerList({ workers }: WorkerListProps) {
  const data =
    workers && workers.length > 0 ? workers : DUMMY_WORKERS;

  return (
    <div className="space-y-4 mt-4">
      {data.map(worker => (
        <WorkerCard key={worker.id} worker={worker} />
      ))}
    </div>
  );
}
