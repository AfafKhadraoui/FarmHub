"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/workspace/dashboard/AdminDashboard";
import { WorkerDashboard } from "@/components/workspace/dashboard/WorkerDashboard";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Please log in to continue</div>
      </div>
    );
  }

  return (
    <>{user.role === "admin" ? <AdminDashboard /> : <WorkerDashboard />}</>
  );
}
