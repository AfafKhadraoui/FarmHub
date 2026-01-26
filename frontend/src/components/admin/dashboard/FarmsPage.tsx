"use client";

import {
  MapPin,
  Users,
  CheckSquare,
  Calendar,
  Eye,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import FarmDetailsPage from "./FarmDetailsPage";

interface FarmListItem {
  id: number;
  name: string;
  owner: string | null;
  email: string | null;
  location: string;
  createdAt: string;
  created: string;
  fields: number;
  tasks: number;
  workers: number;
  status: "active" | "inactive";
}

interface FarmsResponse {
  data: {
    id: number;
    name: string;
    owner: string | null;
    email: string | null;
    location: string;
    workers: number;
    fields: number;
    tasks: number;
    createdAt: string;
    status: string;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<FarmListItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFarms = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(
        `http://localhost:5000/admin/farms?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to load farms: ${res.status}`);
      }

      const json: FarmsResponse = await res.json();

      const mappedFarms: FarmListItem[] = json.data.map((f) => ({
        id: f.id,
        name: f.name,
        owner: f.owner,
        email: f.email,
        location: f.location,
        createdAt: f.createdAt,
        created: new Date(f.createdAt).toLocaleDateString("en-GB"),
        fields: f.fields,
        tasks: f.tasks,
        workers: f.workers,
        status: f.status === "active" ? "active" : "inactive",
      }));

      setFarms(mappedFarms);
      setPagination(json.pagination);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms(1, "");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFarms(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchFarms(page, searchTerm);
  };

  const filteredFarms = farms.filter((farm) => {
    const matchesStatus =
      filterStatus === "all" || farm.status === filterStatus;
    return matchesStatus;
  });

  if (selectedFarmId !== null) {
    return (
      <FarmDetailsPage
        farmId={selectedFarmId}
        onBack={() => {
          setSelectedFarmId(null);
          fetchFarms(pagination.page, searchTerm); // Refresh the list
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--admin-text-dark)]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            All Farms
          </h1>
          <p
            className="text-sm text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Total {pagination.total} farms registered
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 min-w-[220px]"
          >
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--admin-text-muted)]" />
            <input
              type="text"
              placeholder="Search farms by name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] placeholder-[var(--admin-text-muted)] bg-white focus:border-[var(--admin-primary)] outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            />
          </form>

          {/* Filter */}
          <CustomSelect
            value={filterStatus}
            onChange={(v) =>
              setFilterStatus(v as "all" | "active" | "inactive")
            }
            options={[
              { label: "All status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {loading && !farms.length && (
        <p
          className="text-sm text-[var(--admin-text-muted)]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Loading farms...
        </p>
      )}

      {error && (
        <p
          className="text-sm text-red-600"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {error}
        </p>
      )}

      {!loading && !error && filteredFarms.length === 0 && (
        <p
          className="text-sm text-[var(--admin-text-muted)]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          No farms found matching your criteria.
        </p>
      )}

      {/* Farms Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredFarms.map((farm) => (
          <div
            key={farm.id}
            className="group relative bg-white rounded-xl border border-[var(--admin-border)] shadow-md hover:shadow-lg p-6 flex flex-col gap-5 hover:border-[var(--admin-primary)] transition-all cursor-pointer"
            onClick={() => setSelectedFarmId(farm.id)}
          >
            {/* Top row: name + status */}
            <div className="flex items-start justify-between">
              <div>
                <h2
                  className="text-xl font-bold text-[var(--admin-text-dark)]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {farm.name}
                </h2>
                <p
                  className="text-xs text-[var(--admin-text-muted)] mt-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Created: {farm.created}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  farm.status === "active"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="text-[10px]">●</span>
                {farm.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Owner + location */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[var(--admin-text-muted)]" />
                <span
                  className="text-[var(--admin-text-dark)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Owner:{" "}
                  <span className="font-medium">
                    {farm.owner ?? "Unassigned"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[var(--admin-text-muted)]" />
                <span
                  className="text-[var(--admin-text-dark)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {farm.location}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--admin-border)]">
              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                  <p
                    className="text-xs font-medium text-green-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Fields
                  </p>
                </div>
                <p
                  className="text-2xl font-bold text-green-800"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {farm.fields}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p
                    className="text-xs font-medium text-blue-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Tasks
                  </p>
                </div>
                <p
                  className="text-2xl font-bold text-blue-800"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {farm.tasks}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <p
                    className="text-xs font-medium text-purple-700"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Workers
                  </p>
                </div>
                <p
                  className="text-2xl font-bold text-purple-800"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {farm.workers}
                </p>
              </div>
            </div>

            {/* View details */}
            <div className="mt-2 pt-4 border-t border-[var(--admin-border)]">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-primary-dark)] text-white rounded-lg hover:shadow-md transition-all font-medium"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p
            className="text-sm text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Showing {farms.length} of {pagination.total} farms
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 border border-[var(--admin-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Previous
            </button>
            <span
              className="px-4 py-2 text-sm text-[var(--admin-text-dark)]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="px-4 py-2 border border-[var(--admin-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
