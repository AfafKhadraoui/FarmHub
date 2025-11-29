import { useState, useEffect } from 'react';
import { analyticsService, AnalyticsData, MetricsData } from '@/services/analytics.service';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, metricsData] = await Promise.all([
        analyticsService.getAnalytics(),
        analyticsService.getMetrics(),
      ]);
      
      setAnalytics(analyticsData);
      setMetrics(metricsData);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, metrics, loading, error, refetch: fetchAnalytics };
}