import { useState, useEffect } from "react";
import { adminService, type DashboardMetrics } from "@/services/adminService";

export function useDashboardMetrics() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const metrics = await adminService.getMetrics();
        setData(metrics);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard metrics");
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { data, loading, error };
}
