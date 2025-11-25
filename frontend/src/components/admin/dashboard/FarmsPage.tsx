"use client";

import {
  MapPin,
  Users,
  CheckSquare,
  Calendar,
  Eye,
  Search,
} from "lucide-react";
import { useState } from "react";
import CustomSelect from "./CustomSelect";
import FarmDetailsPage from "./FarmDetailsPage";

interface Farm {
  id: number;
  name: string;
  owner: string;
  email: string;
  location: string;
  created: string;
  fields: number;
  tasks: number;
  workers: number;
  status: "active" | "inactive";
}

interface FarmsPageProps {
  farms?: Farm[];
}

const defaultFarmsData: Farm[] = [
  {
    id: 1,
    name: "Green Valley Farm",
    owner: "Ahmed Khalil",
    email: "ahmed@email.com",
    location: "Algiers, Algeria",
    created: "Jan 15, 2025",
    fields: 12,
    tasks: 45,
    workers: 8,
    status: "active",
  },
  {
    id: 2,
    name: "Sunrise Farms",
    owner: "Sara Mansouri",
    email: "sara@email.com",
    location: "Oran, Algeria",
    created: "Jan 18, 2025",
    fields: 8,
    tasks: 32,
    workers: 5,
    status: "active",
  },
  {
    id: 3,
    name: "Golden Harvest",
    owner: "Ali Benali",
    email: "ali@email.com",
    location: "Blida, Algeria",
    created: "Jan 20, 2025",
    fields: 15,
    tasks: 67,
    workers: 12,
    status: "active",
  },
  {
    id: 4,
    name: "Fresh Fields",
    owner: "Fatima Zerrouk",
    email: "fatima@email.com",
    location: "Tizi Ouzou, Algeria",
    created: "Jan 19, 2025",
    fields: 6,
    tasks: 28,
    workers: 4,
    status: "inactive",
  },
  {
    id: 5,
    name: "Organic Paradise",
    owner: "Mohamed Amrani",
    email: "mohamed@email.com",
    location: "Constantine, Algeria",
    created: "Jan 17, 2025",
    fields: 10,
    tasks: 52,
    workers: 7,
    status: "active",
  },
  {
    id: 6,
    name: "Nature's Bounty",
    owner: "Karim Zidane",
    email: "karim@email.com",
    location: "Annaba, Algeria",
    created: "Jan 16, 2025",
    fields: 9,
    tasks: 41,
    workers: 6,
    status: "active",
  },
];

export default function FarmsPage({
  farms = defaultFarmsData,
}: FarmsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const filteredFarms = farms.filter((farm) => {
    const matchesSearch =
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || farm.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Show farm details page if a farm is selected
  if (selectedFarm) {
    return (
      <FarmDetailsPage
        farm={selectedFarm}
        onBack={() => setSelectedFarm(null)}
      />
    );
  }

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2
            className="text-[var(--admin-text-dark)] text-2xl mb-1"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            All Farms
          </h2>
          <p
            className="text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
          >
            Total {farms.length} farms registered
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-[300px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] placeholder-[var(--admin-text-muted)] bg-white focus:border-[var(--admin-primary)] outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            />
          </div>

          {/* Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map((farm) => (
          <div
            key={farm.id}
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6 hover:border-[var(--admin-primary)] hover:shadow-lg transition-all group"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            {/* Farm Name */}
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              {farm.name}
            </h3>

            <div className="h-px bg-[var(--admin-border)] mb-4" />

            {/* Farm Details */}
            <div className="space-y-3 mb-4">
              <div
                className="flex items-center gap-2 text-[var(--admin-text-muted)]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
              >
                <Users size={16} className="text-[var(--admin-primary)]" />
                <span className="text-[var(--admin-text-dark)] font-semibold">
                  Owner:
                </span>{" "}
                {farm.owner}
              </div>
              <div
                className="flex items-center gap-2 text-[var(--admin-text-muted)]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
              >
                <MapPin size={16} className="text-[var(--admin-primary)]" />
                {farm.location}
              </div>
              <div
                className="flex items-center gap-2 text-[var(--admin-text-muted)]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
              >
                <Calendar size={16} className="text-[var(--admin-primary)]" />
                {farm.created}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-[var(--admin-primary)]/5 to-[var(--admin-secondary)]/5 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div
                    className="text-[var(--admin-text-dark)] text-xl"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {farm.fields}
                  </div>
                  <div
                    className="text-[var(--admin-text-muted)] text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Fields
                  </div>
                </div>
                <div>
                  <div
                    className="text-[var(--admin-text-dark)] text-xl"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {farm.tasks}
                  </div>
                  <div
                    className="text-[var(--admin-text-muted)] text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Tasks
                  </div>
                </div>
                <div>
                  <div
                    className="text-[var(--admin-text-dark)] text-xl"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {farm.workers}
                  </div>
                  <div
                    className="text-[var(--admin-text-muted)] text-xs"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Workers
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Action */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  farm.status === "active"
                    ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                    : "bg-gray-200 text-[var(--admin-text-muted)]"
                }`}
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                {farm.status === "active" ? "● Active" : "● Inactive"}
              </span>

              <button
                onClick={() => setSelectedFarm(farm)}
                className="flex items-center gap-1 text-[var(--admin-primary)] hover:text-[var(--admin-primary-dark)] transition-colors opacity-0 group-hover:opacity-100"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFarms.length === 0 && (
        <div className="text-center py-20">
          <p
            className="text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px" }}
          >
            No farms found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
