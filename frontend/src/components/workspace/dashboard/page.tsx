// src/app/workspace/dashboard/page.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from './AdminDashboard';
import { WorkerDashboard } from './WorkerDashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No user found. Please log in.</p>
      </div>
    );
  }

  return (
    <div>
      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <WorkerDashboard />
      )}
    </div>
  );
}
