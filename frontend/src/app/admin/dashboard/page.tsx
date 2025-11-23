"use client";

import Sidebar from "@/components/admin/dashboard/Sidebar";
import TopBar from "@/components/admin/dashboard/TopBar";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import FarmGrowthChart from "@/components/admin/dashboard/FarmGrowthChart";
import RecentFarmsTable from "@/components/admin/dashboard/RecentFarmsTable";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import { Store, Users, CheckSquare, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  icon={Store}
                  value="523"
                  label="Farms"
                  change="+12 today"
                  isPositive={true}
                  gradientColors={[
                    "var(--admin-secondary)",
                    "var(--admin-secondary-dark)",
                  ]}
                />
                <MetricCard
                  icon={Users}
                  value="12,847"
                  label="Users"
                  change="+89 today"
                  isPositive={true}
                  gradientColors={[
                    "var(--admin-primary)",
                    "var(--admin-primary-dark)",
                  ]}
                />
                <MetricCard
                  icon={CheckSquare}
                  value="45,621"
                  label="Tasks Today"
                  change="+1,234 today"
                  isPositive={true}
                  gradientColors={[
                    "var(--admin-blue)",
                    "var(--admin-blue-dark)",
                  ]}
                />
                <MetricCard
                  icon={MapPin}
                  value="6,789"
                  label="Fields Total"
                  change="+45 today"
                  isPositive={true}
                  gradientColors={[
                    "var(--admin-purple)",
                    "var(--admin-purple-dark)",
                  ]}
                />
              </div>

              {/* Farm Growth Chart */}
              <div className="mb-8">
                <FarmGrowthChart />
              </div>

              {/* Recent Farms Table and Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentFarmsTable
                  onViewAll={() => router.push("/admin/dashboard/farms")}
                />
                <ActivityFeed />
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}
