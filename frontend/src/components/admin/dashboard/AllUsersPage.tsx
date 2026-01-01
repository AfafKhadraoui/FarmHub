"use client";

import { useEffect, useState } from "react";
import { Search, Download, User, Shield, Loader2 } from "lucide-react";
import CustomSelect from "./CustomSelect";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "worker" | "platform_admin";
  farm: string | null;
  createdAt: string;
  status: string;
  phone?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AllUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug user role
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User role:", user?.role);
  }, [user]);

  // Fetch users
  const fetchUsers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole !== "all" && {
          role: filterRole === "owner" ? "admin" : filterRole,
        }),
      });

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const response = await api.get(`/admin/users?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filterRole]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get display role
  const getDisplayRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Farm Owner";
      case "worker":
        return "Worker";
      case "platform_admin":
        return "Platform Admin";
      default:
        return role;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Farm", "Joined", "Status"];
    const rows = users.map((user) => [
      user.name,
      user.email,
      getDisplayRole(user.role),
      user.farm || "-",
      formatDate(user.createdAt),
      user.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-[var(--admin-text-dark)] text-2xl mb-1"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
        >
          All Users
        </h2>
        <p
          className="text-[var(--admin-text-muted)]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
        >
          Total {pagination.total} users registered
        </p>
      </div>

      {/* Filters and Actions */}
      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] placeholder-[var(--admin-text-muted)] bg-[var(--admin-bg-gray)] focus:border-[var(--admin-primary)] outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            />
          </div>

          <div className="flex gap-3">
            <CustomSelect
              value={filterRole}
              onChange={(role: string) => {
                setFilterRole(role);
              }}
              options={[
                { value: "all", label: "All Roles" },
                { value: "owner", label: "Farm Owners" },
                { value: "worker", label: "Workers" },
              ]}
              placeholder="All Roles"
            />

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              disabled={users.length === 0}
              className="flex items-center gap-2 px-4 h-[44px] rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] hover:bg-[var(--admin-primary)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          }}
        >
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-12 flex items-center justify-center"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <Loader2
            size={32}
            className="animate-spin text-[var(--admin-primary)]"
          />
        </div>
      )}

      {/* Users Table */}
      {!isLoading && (
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl overflow-hidden"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--admin-bg-gray)] border-b border-[var(--admin-border)]">
                <tr>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Role
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Farm
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Joined
                  </th>
                  <th
                    className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-[var(--admin-bg-gray)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === "admin"
                              ? "bg-gradient-to-br from-[var(--admin-secondary)] to-[var(--admin-primary)]"
                              : "bg-gray-300"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Shield size={18} className="text-white" />
                          ) : (
                            <User size={18} className="text-white" />
                          )}
                        </div>
                        <span
                          className="text-[var(--admin-text-dark)]"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "15px",
                          }}
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-[var(--admin-text-muted)]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-[var(--admin-secondary)]/20 text-[var(--admin-secondary-dark)]"
                            : "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                        }`}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {getDisplayRole(user.role)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-[var(--admin-text-muted)]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {user.farm || "-"}
                    </td>
                    <td
                      className="px-6 py-4 text-[var(--admin-text-muted)]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.status === "active"
                            ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                            : "bg-gray-200 text-[var(--admin-text-muted)]"
                        }`}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {user.status === "active" ? "● Active" : "● Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--admin-border)] bg-[var(--admin-bg-gray)]">
              <div
                className="text-[var(--admin-text-muted)]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
              >
                Showing {(currentPage - 1) * 8 + 1} to{" "}
                {Math.min(currentPage * 8, pagination.total)} of{" "}
                {pagination.total} users
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .slice(
                      Math.max(0, currentPage - 2),
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchUsers(page)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          currentPage === page
                            ? "border-[var(--admin-primary)] bg-[var(--admin-primary)] text-white"
                            : "border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-white"
                        }`}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        {page}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && users.length === 0 && !error && (
        <div className="text-center py-20">
          <p
            className="text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px" }}
          >
            No users found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}