"use client";

import { CheckCircle, UserPlus, Award, MapPin, LucideIcon } from "lucide-react";

interface Activity {
  id: number;
  icon: LucideIcon;
  color: string;
  title: string;
  subtitle: string;
  time: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: 1,
    icon: CheckCircle,
    color: "var(--admin-primary)",
    title: 'New farm "Eco Farm" created',
    subtitle: "by karim@email.com",
    time: "2 minutes ago",
  },
  {
    id: 2,
    icon: UserPlus,
    color: "var(--admin-blue)",
    title: "New user registered as worker",
    subtitle: 'joined "Green Valley Farm"',
    time: "15 minutes ago",
  },
  {
    id: 3,
    icon: Award,
    color: "var(--admin-secondary)",
    title: "Task milestone reached",
    subtitle: "50,000 tasks completed today!",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: MapPin,
    color: "var(--admin-primary)",
    title: "New field added",
    subtitle: '"North Field" by Ahmed K.',
    time: "3 hours ago",
  },
];

export default function ActivityFeed({
  activities = defaultActivities,
}: ActivityFeedProps) {
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

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="p-4 rounded-lg border-l-[3px] bg-[var(--admin-bg-gray)] hover:bg-gray-100 transition-colors"
              style={{
                borderLeftColor: activity.color,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 p-2 rounded-lg"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  <Icon size={20} style={{ color: activity.color }} />
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
                    {activity.subtitle}
                  </div>
                  <div
                    className="text-[var(--admin-text-muted)] text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
