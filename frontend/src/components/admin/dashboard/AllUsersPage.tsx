"use client";

import { Search, Download, User, Shield } from "lucide-react";
import { useState } from "react";
import CustomSelect from "./CustomSelect";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "Farm Owner" | "Worker";
  farm: string;
  joined: string;
  status: "active" | "inactive";
}

interface AllUsersPageProps {
  users?: UserData[];
}

const defaultUsersData: UserData[] = [
  {
    id: 1,
    name: "Ahmed Khalil",
    email: "ahmed@email.com",
    role: "Farm Owner",
    farm: "Green Valley Farm",
    joined: "2025-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Sara Mansouri",
    email: "sara@email.com",
    role: "Worker",
    farm: "Green Valley Farm",
    joined: "2025-01-16",
    status: "active",
  },
  {
    id: 3,
    name: "Ali Benali",
    email: "ali@email.com",
    role: "Farm Owner",
    farm: "Sunrise Farms",
    joined: "2025-01-18",
    status: "active",
  },
  {
    id: 4,
    name: "Fatima Zerrouk",
    email: "fatima@email.com",
    role: "Worker",
    farm: "Sunrise Farms",
    joined: "2025-01-18",
    status: "active",
  },
  {
    id: 5,
    name: "Mohamed Amrani",
    email: "mohamed@email.com",
    role: "Farm Owner",
    farm: "Golden Harvest",
    joined: "2025-01-20",
    status: "active",
  },
  {
    id: 6,
    name: "Karim Zidane",
    email: "karim@email.com",
    role: "Worker",
    farm: "Golden Harvest",
    joined: "2025-01-20",
    status: "active",
  },
  {
    id: 7,
    name: "Amina Bouaziz",
    email: "amina@email.com",
    role: "Worker",
    farm: "Green Valley Farm",
    joined: "2025-01-17",
    status: "inactive",
  },
  {
    id: 8,
    name: "Youssef Hamdi",
    email: "youssef@email.com",
    role: "Farm Owner",
    farm: "Fresh Fields",
    joined: "2025-01-19",
    status: "active",
  },
  {
    id: 9,
    name: "Nadia Slimani",
    email: "nadia@email.com",
    role: "Worker",
    farm: "Fresh Fields",
    joined: "2025-01-19",
    status: "active",
  },
  {
    id: 10,
    name: "Rachid Meziane",
    email: "rachid@email.com",
    role: "Worker",
    farm: "Organic Paradise",
    joined: "2025-01-17",
    status: "active",
  },
];

export default function AllUsersPage({
  users = defaultUsersData,
}: AllUsersPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
          Total {users.length} users registered
        </p>
      </div>

      {/* Filters and Actions */}
      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-6 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-10 pr-4 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-dark)] placeholder-[var(--admin-text-muted)] bg-[var(--admin-bg-gray)] focus:border-[var(--admin-primary)] outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            />
          </div>

          <div className="flex gap-3">
            {/* Role Filter */}
            <CustomSelect
              value={filterRole}
              onChange={setFilterRole}
              options={[
                { value: "all", label: "All Roles" },
                { value: "owner", label: "Farm Owners" },
                { value: "worker", label: "Workers" },
              ]}
              placeholder="All Roles"
            />

            {/* Export Button */}
            <button
              className="flex items-center gap-2 px-4 h-[44px] rounded-lg border-2 border-[var(--admin-primary)] text-[var(--admin-primary)] hover:bg-[var(--admin-primary)] hover:text-white transition-all"
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

      {/* Users Table */}
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
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Name
                </th>
                <th
                  className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Email
                </th>
                <th
                  className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Role
                </th>
                <th
                  className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Farm
                </th>
                <th
                  className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Joined
                </th>
                <th
                  className="text-left px-6 py-4 text-[var(--admin-text-muted)] text-sm uppercase"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-[var(--admin-bg-gray)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === "Farm Owner"
                            ? "bg-gradient-to-br from-[var(--admin-secondary)] to-[var(--admin-primary)]"
                            : "bg-gray-300"
                        }`}
                      >
                        {user.role === "Farm Owner" ? (
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
                        user.role === "Farm Owner"
                          ? "bg-[var(--admin-secondary)]/20 text-[var(--admin-secondary-dark)]"
                          : "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"
                      }`}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-[var(--admin-text-muted)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {user.farm}
                  </td>
                  <td
                    className="px-6 py-4 text-[var(--admin-text-muted)]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {new Date(user.joined).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--admin-border)] bg-[var(--admin-bg-gray)]">
          <div
            className="text-[var(--admin-text-muted)]"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
          >
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
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
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
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
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
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
