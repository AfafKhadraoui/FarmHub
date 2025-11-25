"use client";

import { ArrowRight } from "lucide-react";

interface Farm {
  name: string;
  owner: string;
  location: string;
  created: string;
}

interface RecentFarmsTableProps {
  farms?: Farm[];
  onViewAll?: () => void;
}

const defaultFarms: Farm[] = [
  {
    name: "Green Valley Farm",
    owner: "Ahmed K.",
    location: "Algiers",
    created: "2h ago",
  },
  {
    name: "Sunrise Farms",
    owner: "Sara M.",
    location: "Oran",
    created: "5h ago",
  },
  {
    name: "Golden Harvest",
    owner: "Ali B.",
    location: "Blida",
    created: "1d ago",
  },
  {
    name: "Fresh Fields",
    owner: "Fatima Z.",
    location: "Tizi Ouzou",
    created: "2d ago",
  },
  {
    name: "Organic Paradise",
    owner: "Mohamed A.",
    location: "Constantine",
    created: "3d ago",
  },
];

export default function RecentFarmsTable({
  farms = defaultFarms,
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

      {/* Table */}
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
            {farms.map((farm, index) => (
              <tr
                key={index}
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
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}
                >
                  {farm.owner}
                </td>
                <td
                  className="py-4 text-[var(--admin-text-muted)]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}
                >
                  {farm.location}
                </td>
                <td
                  className="py-4 text-[var(--admin-text-muted)]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
                >
                  {farm.created}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
