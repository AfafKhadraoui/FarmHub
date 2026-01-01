import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import type { RecentFarm } from "@/services/adminService";

export function useRecentFarms() {
  const [data, setData] = useState<RecentFarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminService.getRecentFarms();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recent farms"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
