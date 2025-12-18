// src/components/workspace/workers/WorkerCard.tsx
'use client';

import { Button } from '@/components/ui/button';

interface WorkerCardProps {
  worker: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatarInitials?: string;
    assignedTasks: number;
    completedTasks: number;
    performancePercent: number;
    status?: 'active' | 'inactive';
  };
  onViewProfile?: () => void;
  onAssignTasks?: () => void;
  onContact?: () => void;
}

export function WorkerCard({
  worker,
  onViewProfile,
  onAssignTasks,
  onContact,
}: WorkerCardProps) {
  const {
    name,
    email,
    phone,
    avatarInitials,
    assignedTasks,
    completedTasks,
    performancePercent,
    status = 'active',
  } = worker;

  return (
      <div 
      className="w-full rounded-2xl border bg-white p-8 shadow-sm hover:shadow-lg transition-all"
      style={{ borderColor: 'var(--admin-border)', borderWidth: '1px' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--admin-primary)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--admin-border)';
      }}
    >
      <div className="flex items-start justify-between gap-6">
        {/* avatar + info */}
        <div className="flex items-start gap-4">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold relative"
            style={{ backgroundColor: 'var(--admin-primary)' }}
          >
            {avatarInitials ??
              name
                ?.split(' ')
                .map(p => p[0])
                .join('')
                .toUpperCase()}
            <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-white flex items-center justify-center">
              <span 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: status === 'active' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
              />
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[22px] font-semibold" style={{ color: 'var(--admin-text-dark)' }}>
              {name}
            </p>
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{email}</p>
            {phone && (
              <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>{phone}</p>
            )}

            <p className="mt-3 text-sm" style={{ color: 'var(--admin-text-muted)' }}>
              Assigned Tasks:{' '}
              <span className="font-semibold" style={{ color: 'var(--admin-text-dark)' }}>
                {assignedTasks}
              </span>{' '}
              • Completed:{' '}
              <span className="font-semibold" style={{ color: 'var(--admin-text-dark)' }}>
                {completedTasks}
              </span>
            </p>
          </div>
        </div>

        {/* status pill */}
        <div className="flex items-center">
          <span 
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium"
            style={{ 
              backgroundColor: status === 'active' ? '#DCFCE7' : '#F3F4F6',
              color: status === 'active' ? '#15803D' : 'var(--admin-text-muted)'
            }}
          >
            <span 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: status === 'active' ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}
            />
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* performance removed as requested */}

      {/* buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          className="h-11 rounded-lg text-white px-6 text-[16px] font-semibold"
          style={{ backgroundColor: 'var(--admin-primary)' }}
          onClick={onViewProfile}
        >
          View Profile
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
          onClick={onAssignTasks}
        >
          Assign Tasks
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-lg bg-white px-6 text-[16px] font-semibold"
          style={{ 
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-dark)'
          }}
          onClick={onContact}
        >
          Contact
        </Button>
      </div>
    </div>
  );
}
