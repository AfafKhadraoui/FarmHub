"use client";

import {
  MapPin,
  Users,
  CheckSquare,
  Calendar,
  Mail,
  ArrowLeft,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../common/DeleteConfirmationModal";

interface FarmDetails {
  id: number;
  name: string;
  location: string;
  joinCode: string;
  createdAt: string;
  owner: { id: number; name: string; email: string } | null;
  workers: { id: number; name: string; email: string }[];
  fields: {
    id: number;
    name: string;
    size: number;
    cropType: string;
    status: string;
  }[];
  stats: {
    totalWorkers: number;
    totalFields: number;
    activeTasks: number;
    completedTasks: number;
  };
}

interface FarmDetailsPageProps {
  farmId: number;
  onBack: () => void;
}

export default function FarmDetailsPage({
  farmId,
  onBack,
}: FarmDetailsPageProps) {
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        const res = await fetch(
          `http://localhost:5000/admin/farms/${farmId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load farm: ${res.status}`);
        }

        const data: FarmDetails = await res.json();
        setFarm(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load farm details");
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [farmId]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      const res = await fetch(
        `http://localhost:5000/admin/farms/${farmId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete farm: ${res.status}`);
      }

      onBack(); // back to list; FarmsPage will re-fetch
    } catch (err) {
      console.error(err);
      alert("Failed to delete farm");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-[var(--admin-text-muted)]">
        Loading farm details...
      </p>
    );
  }

  if (error || !farm) {
    return (
      <div className="space-y-3">
        <button
          onClick={onBack}
          className="text-sm text-[var(--admin-primary)] underline"
        >
          ← Back to farms
        </button>
        <p className="text-sm text-red-600">
          {error || "Failed to load farm details."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Back & Delete */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={20} />
          Back to Farms
        </button>

        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <Trash2 size={16} />
          Delete
        </button>

        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Farm"
          description="Are you sure you want to delete this farm? This action will permanently remove all associated fields, tasks, and worker assignments."
          isDeleting={isDeleting}
        />
      </div>

      {/* Header Card */}
      <div
        className="bg-white border border-[var(--admin-border)] rounded-2xl p-8 mb-6"
        style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-[var(--admin-text-dark)] text-3xl mb-2"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800 }}
            >
              {farm.name}
            </h1>
            <p
              className="text-[var(--admin-text-muted)]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            >
              {farm.location}
            </p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            ● Active
          </span>
        </div>

        {/* Owner / Email / Created / Join code */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Users size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Owner
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.owner?.name || "Unassigned"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Mail size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Email
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.owner?.email || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <Calendar size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Created
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {new Date(farm.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
              <CheckSquare size={20} className="text-[var(--admin-primary)]" />
            </div>
            <div>
              <div
                className="text-[var(--admin-text-muted)] text-sm mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Join code
              </div>
              <div
                className="text-[var(--admin-text-dark)] font-semibold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {farm.joinCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Fields
            </div>
            <MapPin size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farm.stats.totalFields}
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Active Tasks
            </div>
            <CheckSquare size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farm.stats.activeTasks}
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Total Workers
            </div>
            <Users size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farm.stats.totalWorkers}
          </div>
        </div>

        <div
          className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
          style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[var(--admin-text-muted)] text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Completed Tasks
            </div>
            <TrendingUp size={18} className="text-[var(--admin-primary)]" />
          </div>
          <div
            className="text-[var(--admin-text-dark)] text-3xl font-bold mb-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {farm.stats.completedTasks}
          </div>
        </div>
      </div>

      {/* Fields + workers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Fields */}
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Fields Overview
            </h3>

            <div className="space-y-4">
              {farm.fields.map((field) => (
                <div
                  key={field.id}
                  className="border border-[var(--admin-border)] rounded-xl p-4 hover:border-[var(--admin-primary)] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 flex items-center justify-center">
                        <MapPin
                          size={18}
                          className="text-[var(--admin-primary)]"
                        />
                      </div>
                      <div>
                        <div
                          className="text-[var(--admin-text-dark)] font-semibold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {field.name}
                        </div>
                        <div
                          className="text-[var(--admin-text-muted)] text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {field.size} ha • {field.cropType}
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {field.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workers */}
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-4"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Team Members
            </h3>

            <div className="space-y-3">
              {farm.workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[var(--admin-border)] hover:border-[var(--admin-primary)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-secondary)] flex items-center justify-center text-white font-semibold"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-[var(--admin-text-dark)] font-semibold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {worker.name}
                      </div>
                      <div
                        className="text-[var(--admin-text-muted)] text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {worker.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column placeholder: recent activity, info, etc. (optional) */}
        <div className="space-y-6">
          <div
            className="bg-white border border-[var(--admin-border)] rounded-2xl p-6"
            style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.04)" }}
          >
            <h3
              className="text-[var(--admin-text-dark)] text-xl mb-2"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Activity
            </h3>
            <p
              className="text-sm text-[var(--admin-text-muted)]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              You can hook this to a farm-specific activity feed later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
