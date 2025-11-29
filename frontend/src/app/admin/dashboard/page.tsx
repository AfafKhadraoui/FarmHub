"use client";

import Sidebar from "@/components/admin/dashboard/Sidebar";
import TopBar from "@/components/admin/dashboard/TopBar";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import FarmGrowthChart from "@/components/admin/dashboard/FarmGrowthChart";
import RecentFarmsTable from "@/components/admin/dashboard/RecentFarmsTable";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import { Store, Users, CheckSquare, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useRecentFarms } from "@/hooks/useRecentFarms";
import { useActivities } from "@/hooks/useActivities";
import { useFarmGrowth } from "@/hooks/useFarmGrowth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: metrics, loading, error } = useDashboardMetrics();
  const {
    data: recentFarms,
    loading: farmsLoading,
    error: farmsError,
  } = useRecentFarms();
  const {
    data: activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useActivities();
  const {
    data: farmGrowthData,
    loading: growthLoading,
    error: growthError,
  } = useFarmGrowth();

  return (
    <>
      {/* Add Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-[var(--admin-bg)]">
        {/* Sidebar */}
        <Sidebar
          activePage="overview"
          onPageChange={(page) =>
            router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
          }
        />

        {/* Main Content Area */}
        <div className="ml-[280px]">
          {/* Top Bar */}
          <TopBar
            pageTitle="Overview"
            onNavigate={(page) =>
              router.push(`/admin/dashboard/${page === "overview" ? "" : page}`)
            }
          />

          {/* Content */}
          <div className="pt-[112px] p-8">
            <>
              {/* Welcome Section */}
              <div className="mb-8 p-8 rounded-2xl border border-[var(--admin-border)] bg-gradient-to-br from-[var(--admin-primary)]/5 to-[var(--admin-secondary)]/5">
                <h1
                  className="text-[var(--admin-text-dark)] text-3xl mb-2"
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  Welcome to Platform Admin
                </h1>
                <p
                  className="text-[var(--admin-text-muted)] mb-3"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  Monitor and manage the entire FarmHub platform
                </p>
                <div
                  className="text-[var(--admin-text-muted)] text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Last updated:{" "}
                  <span className="text-[var(--admin-primary)] font-semibold">
                    Just now
                  </span>
                </div>
              </div>
              {/* Key Metrics */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
                    >
                      <div className="h-12 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                  <p className="text-red-600 font-medium">
                    Failed to load metrics
                  </p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    icon={Store}
                    value={metrics?.totalFarms.toLocaleString() || "0"}
                    label="Farms"
                    change={`+${metrics?.farmsToday || 0} today`}
                    isPositive={true}
                    gradientColors={[
                      "var(--admin-secondary)",
                      "var(--admin-secondary-dark)",
                    ]}
                  />
                  <MetricCard
                    icon={Users}
                    value={metrics?.totalUsers.toLocaleString() || "0"}
                    label="Users"
                    change={`+${metrics?.usersToday || 0} today`}
                    isPositive={true}
                    gradientColors={[
                      "var(--admin-primary)",
                      "var(--admin-primary-dark)",
                    ]}
                  />
                  <MetricCard
                    icon={CheckSquare}
                    value={metrics?.totalTasks.toLocaleString() || "0"}
                    label="Tasks Total"
                    change={`+${metrics?.tasksToday || 0} today`}
                    isPositive={true}
                    gradientColors={[
                      "var(--admin-blue)",
                      "var(--admin-blue-dark)",
                    ]}
                  />
                  <MetricCard
                    icon={MapPin}
                    value={metrics?.totalFields.toLocaleString() || "0"}
                    label="Fields Total"
                    change={`+${metrics?.fieldsToday || 0} today`}
                    isPositive={true}
                    gradientColors={[
                      "var(--admin-purple)",
                      "var(--admin-purple-dark)",
                    ]}
                  />
                </div>
              )}
              {/* Farm Growth Chart */}
              <div className="mb-8">
                <FarmGrowthChart
                  data={farmGrowthData}
                  loading={growthLoading}
                  error={growthError}
                />
              </div>{" "}
              {/* Recent Farms Table and Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentFarmsTable
                  farms={recentFarms}
                  loading={farmsLoading}
                  error={farmsError}
                  onViewAll={() => router.push("/admin/dashboard/farms")}
                />
                <ActivityFeed
                  activities={activities}
                  loading={activitiesLoading}
                  error={activitiesError}
                />
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
