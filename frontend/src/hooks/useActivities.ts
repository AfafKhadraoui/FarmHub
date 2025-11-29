import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import type { Activity } from "@/services/adminService";

export function useActivities() {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminService.getActivities();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load activities"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
