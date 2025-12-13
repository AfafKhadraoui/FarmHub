"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardContent from "@/components/admin/dashboard/DashboardContent";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="platform_admin">
      <DashboardContent />
    </ProtectedRoute>
  );
}
