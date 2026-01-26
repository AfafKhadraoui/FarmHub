"use client";

import { Activity as ActivityIcon } from "lucide-react";
import { Activity } from "@/services/adminService";
import { useState } from "react";

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  error?: string | null;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function ActivityFeed({
  activities,
  loading,
  error,
}: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 4);
  return (
    <div
      className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
      style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
    >
      <h3
        className="text-[var(--admin-text-dark)] text-xl mb-6"
        style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
      >
        Real-Time System Activity
      </h3>

      <div className="h-px bg-[var(--admin-border)] mb-6" />

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No recent activity</div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg border-l-[3px] bg-[var(--admin-bg-gray)] hover:bg-gray-100 transition-colors"
                style={{
                  borderLeftColor: "var(--admin-primary)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-1 p-2 rounded-lg"
                    style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                  >
                    <ActivityIcon
                      size={20}
                      className="text-[var(--admin-primary)]"
                    />
                  </div>

                  <div className="flex-1">
                    <div
                      className="text-[var(--admin-text-dark)] mb-1"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "15px",
                      }}
                    >
                      {activity.title}
                    </div>
                    <div
                      className="text-[var(--admin-text-muted)] mb-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {activity.message}
                    </div>
                    <div
                      className="text-[var(--admin-text-muted)] text-xs"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {getTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activities.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 py-2 text-sm font-medium text-[var(--admin-primary)] hover:bg-gray-50 rounded-lg transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {showAll
                ? "Show Less"
                : `Show More (${activities.length - 4} more)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
