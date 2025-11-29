import { useState, useEffect } from "react";
import { adminService, FarmGrowthData } from "@/services/adminService";

export function useFarmGrowth() {
  const [data, setData] = useState<FarmGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const growthData = await adminService.getFarmGrowth();
        setData(growthData);
      } catch (err) {
        console.error("Error fetching farm growth:", err);
        setError("Failed to load farm growth data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
