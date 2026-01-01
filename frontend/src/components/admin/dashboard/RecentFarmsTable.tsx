"use client";

import { ArrowRight } from "lucide-react";
import { RecentFarm } from "@/services/adminService";

interface RecentFarmsTableProps {
  farms: RecentFarm[];
  loading?: boolean;
  error?: string | null;
  onViewAll?: () => void;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function RecentFarmsTable({
  farms,
  loading,
  error,
  onViewAll,
}: RecentFarmsTableProps) {
  return (
    <div
      className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
    >
      <h3
        className="text-[var(--admin-text-dark)] text-xl mb-6"
        style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
      >
        Recently Created Farms
      </h3>

      <div className="h-px bg-[var(--admin-border)] mb-6" />

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded flex-1"></div>
              <div className="h-12 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No farms created yet
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                <th
                  className="text-left pb-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Farm Name
                </th>
                <th
                  className="text-left pb-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Owner
                </th>
                <th
                  className="text-left pb-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Location
                </th>
                <th
                  className="text-left pb-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm) => (
                <tr
                  key={farm.id}
                  className="border-b border-gray-100 hover:bg-[var(--admin-bg-gray)] transition-colors"
                >
                  <td
                    className="py-4 text-[var(--admin-text-dark)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                    }}
                  >
                    {farm.name}
                  </td>
                  <td
                    className="py-4 text-[var(--admin-text-muted)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  >
                    {farm.owner || "N/A"}
                  </td>
                  <td
                    className="py-4 text-[var(--admin-text-muted)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                    }}
                  >
                    {farm.location}
                  </td>
                  <td
                    className="py-4 text-[var(--admin-text-muted)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {getTimeAgo(farm.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View All Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onViewAll}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] hover:bg-[var(--admin-primary)] hover:text-white transition-all shadow-sm"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          View All Farms
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
